package net.sytes.dwms.etl_pipeline;

import net.sytes.dwms.etl_pipeline.functions.TotalValidator;
import net.sytes.dwms.decode_lib.functions.decoders.VroomDecoder;
import net.sytes.dwms.etl_pipeline.influxdb.sink2.InfluxDBSink;
import net.sytes.dwms.decode_lib.models.CanonicTotal;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.connector.kafka.source.KafkaSource;

import java.util.Properties;

public class DataStreamJob {
	private static final Properties properties = Utils.loadProperties();

	public static void main(String[] args) throws Exception {
		// Set up the execution environment, which is the main entry point to building Flink applications.
		final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		// Read telemetry data from Kafka
		final KafkaSource<String> kafkaSource = KafkaSource.<String>builder()
			.setBootstrapServers(properties.getProperty("KAFKA_URL"))
			.setTopics("vroom-total")
			.setStartingOffsets(OffsetsInitializer.latest())
			.setValueOnlyDeserializer(new SimpleStringSchema())
			.build();
		final DataStream<String> rawTotal = env.fromSource(kafkaSource, WatermarkStrategy.noWatermarks(), "total-kafka");

		// Decode JSON strings
		final DataStream<CanonicTotal> decodedTotal = rawTotal.map(new VroomDecoder()).uid("decoded");

		// Validate telemetry data
		final DataStream<CanonicTotal> validatedData = decodedTotal.filter(new TotalValidator()).uid("validated");

		// Insert telemetry data into InfluxDB
        InfluxDBSink<CanonicTotal> influxDBSink = InfluxDBSink.builder()
			.setInfluxDBSchemaSerializer(new CanonicTotalSerializer())
			.setInfluxDBUrl(properties.getProperty("INFLUXDB_URL"))
			.setInfluxDBToken(properties.getProperty("INFLUXDB_TOKEN"))
			.setInfluxDBBucket(properties.getProperty("INFLUXDB_BUCKET"))
			.setInfluxDBOrganization(properties.getProperty("INFLUXDB_ORG"))
			.setWriteBufferSize(1)
			.build();
		validatedData.sinkTo(influxDBSink);

		// Execute program, beginning computation.
		env.execute("ETL Pipeline");
	}
}
