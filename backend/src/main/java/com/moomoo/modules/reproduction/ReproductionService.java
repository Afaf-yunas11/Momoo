package com.moomoo.modules.reproduction;

import com.moomoo.exception.ResourceNotFoundException;
import com.moomoo.modules.animal.AnimalRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ReproductionService {

    private final BreedingRecordRepository breedingRecordRepository;
    private final CalvingRecordRepository calvingRecordRepository;
    private final AnimalRepository animalRepository;

    public ReproductionService(BreedingRecordRepository breedingRecordRepository,
                               CalvingRecordRepository calvingRecordRepository,
                               AnimalRepository animalRepository) {
        this.breedingRecordRepository = breedingRecordRepository;
        this.calvingRecordRepository = calvingRecordRepository;
        this.animalRepository = animalRepository;
    }

    public List<BreedingRecord> breedingRecords() {
        return breedingRecordRepository.findAll();
    }

    public BreedingRecord addBreedingRecord(UUID animalId, BreedingRecord record) {
        record.setAnimal(animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId)));
        if (record.getExpectedCalving() == null && record.getBreedingDate() != null) {
            record.setExpectedCalving(record.getBreedingDate().plusDays(283));
        }
        return breedingRecordRepository.save(record);
    }

    public BreedingRecord confirmPregnancy(UUID id, LocalDate confirmationDate) {
        BreedingRecord record = breedingRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Breeding record not found: " + id));
        record.setPregnancyConfirmed(true);
        record.setConfirmationDate(confirmationDate);
        if (record.getExpectedCalving() == null && record.getBreedingDate() != null) {
            record.setExpectedCalving(record.getBreedingDate().plusDays(283));
        }
        return breedingRecordRepository.save(record);
    }

    public List<CalvingRecord> calvingRecords() {
        return calvingRecordRepository.findAll();
    }

    public CalvingRecord addCalvingRecord(UUID animalId, CalvingRecord record) {
        record.setAnimal(animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId)));
        return calvingRecordRepository.save(record);
    }

    public Map<String, Object> herdSummary() {
        return Map.of("breedingRecords", breedingRecordRepository.count(), "calvingRecords", calvingRecordRepository.count());
    }
}
