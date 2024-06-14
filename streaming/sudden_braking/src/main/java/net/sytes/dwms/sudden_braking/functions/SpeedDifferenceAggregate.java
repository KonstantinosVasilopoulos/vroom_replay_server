package net.sytes.dwms.sudden_braking.functions;

import net.sytes.dwms.decode_lib.models.CanonicTotal;
import net.sytes.dwms.sudden_braking.models.SuddenBrakingEvent;
import org.apache.flink.api.common.functions.AggregateFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SpeedDifferenceAggregate implements AggregateFunction<CanonicTotal, SuddenBrakingEvent, SuddenBrakingEvent> {
    private static final Logger LOG = LoggerFactory.getLogger(SpeedDifferenceAggregate.class);

    @Override
    public SuddenBrakingEvent createAccumulator() {
        return new SuddenBrakingEvent(null, Long.MAX_VALUE, Long.MIN_VALUE, 0L, 0);
    }

    @Override
    public SuddenBrakingEvent add(CanonicTotal total, SuddenBrakingEvent suddenBrakingEvent) {
        suddenBrakingEvent.setCarId(total.getCarId());

        // Determine start and end timestamps
        if (total.getTimestamp() < suddenBrakingEvent.getStart()) {
            suddenBrakingEvent.setStart(total.getTimestamp());
        }

        if (total.getTimestamp() > suddenBrakingEvent.getEnd()) {
            suddenBrakingEvent.setEnd(total.getTimestamp());
        }

        // Determine min and max speed
        if (total.getSpeed() > suddenBrakingEvent.getMaxSpeed()) {
            suddenBrakingEvent.setMaxSpeed(total.getSpeed());
        }

        if (total.getSpeed() < suddenBrakingEvent.getMinSpeed()) {
            suddenBrakingEvent.setMinSpeed(total.getSpeed());
        }

        return suddenBrakingEvent;
    }

    @Override
    public SuddenBrakingEvent getResult(SuddenBrakingEvent suddenBrakingEvent) {
        return suddenBrakingEvent;
    }

    @Override
    public SuddenBrakingEvent merge(SuddenBrakingEvent suddenBrakingEvent, SuddenBrakingEvent acc1) {
        suddenBrakingEvent.setStart(Math.min(suddenBrakingEvent.getStart(), acc1.getStart()));
        suddenBrakingEvent.setEnd(Math.max(suddenBrakingEvent.getEnd(), acc1.getEnd()));
        suddenBrakingEvent.setMinSpeed(Math.min(suddenBrakingEvent.getMinSpeed(), acc1.getMinSpeed()));
        suddenBrakingEvent.setMaxSpeed(Math.max(suddenBrakingEvent.getMaxSpeed(), acc1.getMaxSpeed()));
        return suddenBrakingEvent;
    }
}
