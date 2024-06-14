/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package net.sytes.dwms.not_reporting;

import net.sytes.dwms.decode_lib.functions.decoders.VroomDecoder;
import net.sytes.dwms.decode_lib.models.CanonicTotal;
import net.sytes.dwms.not_reporting.functions.NotReportingDetector;
import net.sytes.dwms.not_reporting.functions.TotalValidator;
import net.sytes.dwms.not_reporting.influxdb.sink2.InfluxDBSink;
import net.sytes.dwms.not_reporting.models.NotReportingEvent;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

import java.util.Properties;

public class DataStreamJob {
	private static final Properties properties = Utils.loadProperties();

	public static void main(String[] args) throws Exception {
		// Sets up the execution environment, which is the main entry point to building Flink applications
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

		// Identify not reporting events
		final DataStream<NotReportingEvent> notReportingEvents = validatedData
				.keyBy(CanonicTotal::getCarId)
				.process(new NotReportingDetector())
				.uid("not-reporting-detector");

		// Insert events into InfluxDB
		InfluxDBSink<NotReportingEvent> influxDBSink = InfluxDBSink.builder()
				.setInfluxDBSchemaSerializer(new NotReportingEventSerializer())
				.setInfluxDBUrl(properties.getProperty("INFLUXDB_URL"))
				.setInfluxDBToken(properties.getProperty("INFLUXDB_TOKEN"))
				.setInfluxDBBucket(properties.getProperty("INFLUXDB_BUCKET"))
				.setInfluxDBOrganization(properties.getProperty("INFLUXDB_ORG"))
				.setWriteBufferSize(1)
				.build();
		notReportingEvents.sinkTo(influxDBSink);

		// Execute program, beginning computation
		env.execute("Not Reporting Job");
	}
}
