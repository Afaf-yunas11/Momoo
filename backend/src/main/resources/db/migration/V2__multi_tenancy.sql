CREATE TABLE farms (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create a default farm
INSERT INTO farms (id, name, created_at, is_active)
VALUES (gen_random_uuid(), 'Default Smart Farm', CURRENT_TIMESTAMP, TRUE);

-- Helper variable for the default farm ID
DO $$
DECLARE
    default_farm_id UUID;
BEGIN
    SELECT id INTO default_farm_id FROM farms LIMIT 1;

    -- Add farm_id to users
    ALTER TABLE users ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE users SET farm_id = default_farm_id;

    -- Add farm_id to domain tables
    ALTER TABLE animals ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE animals SET farm_id = default_farm_id;
    ALTER TABLE animals ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE weight_records ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE weight_records SET farm_id = default_farm_id;
    ALTER TABLE weight_records ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE milk_records ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE milk_records SET farm_id = default_farm_id;
    ALTER TABLE milk_records ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE feed_types ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE feed_types SET farm_id = default_farm_id;
    ALTER TABLE feed_types ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE feed_records ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE feed_records SET farm_id = default_farm_id;
    ALTER TABLE feed_records ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE feed_inventory ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE feed_inventory SET farm_id = default_farm_id;
    ALTER TABLE feed_inventory ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE vaccinations ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE vaccinations SET farm_id = default_farm_id;
    ALTER TABLE vaccinations ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE disease_records ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE disease_records SET farm_id = default_farm_id;
    ALTER TABLE disease_records ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE ai_alerts ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE ai_alerts SET farm_id = default_farm_id;
    ALTER TABLE ai_alerts ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE breeding_records ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE breeding_records SET farm_id = default_farm_id;
    ALTER TABLE breeding_records ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE calving_records ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE calving_records SET farm_id = default_farm_id;
    ALTER TABLE calving_records ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE revenue_records ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE revenue_records SET farm_id = default_farm_id;
    ALTER TABLE revenue_records ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE expense_records ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE expense_records SET farm_id = default_farm_id;
    ALTER TABLE expense_records ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE environment_logs ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE environment_logs SET farm_id = default_farm_id;
    ALTER TABLE environment_logs ALTER COLUMN farm_id SET NOT NULL;

    -- Rename reports_archive to report_archives to match the entity
    ALTER TABLE reports_archive RENAME TO report_archives;

    ALTER TABLE report_archives ADD COLUMN farm_id UUID REFERENCES farms(id);
    ALTER TABLE report_archives ADD COLUMN title VARCHAR(255);
    UPDATE report_archives SET farm_id = default_farm_id;
    ALTER TABLE report_archives ALTER COLUMN farm_id SET NOT NULL;

    ALTER TABLE system_config ADD COLUMN farm_id UUID REFERENCES farms(id);
    UPDATE system_config SET farm_id = default_farm_id;
    ALTER TABLE system_config ALTER COLUMN farm_id SET NOT NULL;

END $$;
