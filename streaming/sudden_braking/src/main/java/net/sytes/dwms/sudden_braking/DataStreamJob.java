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

package net.sytes.dwms.sudden_braking;

import net.sytes.dwms.decode_lib.functions.decoders.VroomDecoder;
import net.sytes.dwms.decode_lib.models.CanonicTotal;
import net.sytes.dwms.sudden_braking.functions.SpeedDifferenceAggregate;
import net.sytes.dwms.sudden_braking.functions.SuddenBrakingEventFilter;
import net.sytes.dwms.sudden_braking.functions.TotalValidator;
import net.sytes.dwms.sudden_braking.influxdb.sink2.InfluxDBSink;
import net.sytes.dwms.sudden_braking.models.SuddenBrakingEvent;
import net.sytes.dwms.sudden_braking.triggers.EventTrigger;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.assigners.SlidingEventTimeWindows;
import org.apache.flink.streaming.api.windowing.time.Time;

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

		// Identify CPU high load events using a sliding window
		long windowSize = Utils.secsToMillis(Double.parseDouble(properties.getProperty("SUDDEN_BRAKING_WINDOW_SIZE_SEC"))); // millis
		long windowSlide = Utils.secsToMillis(Double.parseDouble(properties.getProperty("SUDDEN_BRAKING_WINDOW_SLIDE_SEC"))); // millis
		final DataStream<SuddenBrakingEvent> suddenBrakingEvents = validatedData
			.keyBy(CanonicTotal::getCarId)
			.window(SlidingEventTimeWindows.of(Time.milliseconds(windowSize), Time.milliseconds(windowSlide)))
			.trigger(new EventTrigger<>())
			.aggregate(new SpeedDifferenceAggregate())
			.uid("sudden-braking-events");

		// Filter out events that are below the threshold
		final DataStream<SuddenBrakingEvent> validEvents = suddenBrakingEvents
			.filter(new SuddenBrakingEventFilter())
			.uid("valid-sudden-braking-events");

		// Insert events into InfluxDB
		InfluxDBSink<SuddenBrakingEvent> influxDBSink = InfluxDBSink.builder()
				.setInfluxDBSchemaSerializer(new SuddenBrakingEventSerializer())
				.setInfluxDBUrl(properties.getProperty("INFLUXDB_URL"))
				.setInfluxDBToken(properties.getProperty("INFLUXDB_TOKEN"))
				.setInfluxDBBucket(properties.getProperty("INFLUXDB_BUCKET"))
				.setInfluxDBOrganization(properties.getProperty("INFLUXDB_ORG"))
				.setWriteBufferSize(1)
				.build();
		validEvents.sinkTo(influxDBSink);

		// Execute program, beginning computation
		env.execute("Sudden Braking Job");
	}
}
