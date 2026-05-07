package com.moomoo.modules.environment;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EnvironmentService {

    private final EnvironmentLogRepository environmentLogRepository;

    public EnvironmentService(EnvironmentLogRepository environmentLogRepository) {
        this.environmentLogRepository = environmentLogRepository;
    }

    public List<EnvironmentLog> findAll() {
        return environmentLogRepository.findAll();
    }

    public EnvironmentLog create(EnvironmentLog log) {
        if (log.getMaxTempC() != null && log.getHumidityPct() != null) {
            BigDecimal thi = log.getMaxTempC()
                    .multiply(BigDecimal.valueOf(1.8))
                    .add(BigDecimal.valueOf(32))
                    .subtract(BigDecimal.valueOf(0.55)
                            .multiply(BigDecimal.ONE.subtract(log.getHumidityPct().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)))
                            .multiply(log.getMaxTempC().multiply(BigDecimal.valueOf(1.8)).subtract(BigDecimal.valueOf(26))));
            log.setThiScore(thi.setScale(2, RoundingMode.HALF_UP));
        }
        return environmentLogRepository.save(log);
    }
}
