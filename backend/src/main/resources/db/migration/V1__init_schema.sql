CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP
);

CREATE TABLE animals (
    id UUID PRIMARY KEY,
    tag_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    breed VARCHAR(120) NOT NULL,
    dob DATE,
    purchase_date DATE,
    purchase_price NUMERIC(12, 2),
    status VARCHAR(30) NOT NULL,
    notes TEXT
);

CREATE TABLE weight_records (
    id UUID PRIMARY KEY,
    animal_id UUID NOT NULL REFERENCES animals(id),
    recorded_date DATE NOT NULL,
    weight_kg NUMERIC(8, 2) NOT NULL,
    recorded_by VARCHAR(120)
);

CREATE TABLE milk_records (
    id UUID PRIMARY KEY,
    animal_id UUID NOT NULL REFERENCES animals(id),
    record_date DATE NOT NULL,
    session VARCHAR(20) NOT NULL,
    morning_yield NUMERIC(8, 2),
    evening_yield NUMERIC(8, 2),
    total_yield NUMERIC(8, 2),
    fat_pct NUMERIC(5, 2),
    protein_pct NUMERIC(5, 2),
    scc BIGINT,
    bacterial_load BIGINT,
    machine_used BOOLEAN
);

CREATE TABLE feed_types (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    dry_matter_pct NUMERIC(5, 2),
    crude_protein_pct NUMERIC(5, 2),
    energy_mj NUMERIC(8, 2),
    fiber_pct NUMERIC(5, 2),
    cost_per_kg NUMERIC(10, 2)
);

CREATE TABLE feed_records (
    id UUID PRIMARY KEY,
    animal_id UUID NOT NULL REFERENCES animals(id),
    feed_type_id UUID REFERENCES feed_types(id),
    record_date DATE NOT NULL,
    quantity_kg NUMERIC(8, 2),
    ai_recommended_qty NUMERIC(8, 2),
    cost_pkr NUMERIC(10, 2)
);

CREATE TABLE feed_inventory (
    id UUID PRIMARY KEY,
    feed_type_id UUID NOT NULL REFERENCES feed_types(id),
    stock_kg NUMERIC(10, 2),
    low_stock_threshold NUMERIC(10, 2),
    last_updated TIMESTAMP
);

CREATE TABLE vaccinations (
    id UUID PRIMARY KEY,
    animal_id UUID NOT NULL REFERENCES animals(id),
    vaccine_name VARCHAR(150) NOT NULL,
    batch_no VARCHAR(120),
    date_given DATE NOT NULL,
    dosage_ml NUMERIC(8, 2),
    given_by VARCHAR(120),
    next_due_date DATE
);

CREATE TABLE disease_records (
    id UUID PRIMARY KEY,
    animal_id UUID NOT NULL REFERENCES animals(id),
    event_date DATE NOT NULL,
    symptoms TEXT,
    temperature_c DOUBLE PRECISION,
    blood_test_results TEXT,
    diagnosis VARCHAR(255),
    treatment VARCHAR(255),
    medication VARCHAR(255),
    dosage VARCHAR(100),
    duration_days INTEGER,
    outcome VARCHAR(255),
    vet_name VARCHAR(120)
);

CREATE TABLE ai_alerts (
    id UUID PRIMARY KEY,
    animal_id UUID REFERENCES animals(id),
    alert_type VARCHAR(30) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    recommended_action TEXT,
    created_at TIMESTAMP NOT NULL,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(120)
);

CREATE TABLE breeding_records (
    id UUID PRIMARY KEY,
    animal_id UUID NOT NULL REFERENCES animals(id),
    breeding_date DATE NOT NULL,
    method VARCHAR(20) NOT NULL,
    bull_id VARCHAR(120),
    semen_batch VARCHAR(120),
    technician VARCHAR(120),
    pregnancy_confirmed BOOLEAN,
    confirmation_date DATE,
    expected_calving DATE
);

CREATE TABLE calving_records (
    id UUID PRIMARY KEY,
    animal_id UUID NOT NULL REFERENCES animals(id),
    calving_date DATE NOT NULL,
    calf_sex VARCHAR(20),
    calf_weight_kg NUMERIC(8, 2),
    outcome VARCHAR(120)
);

CREATE TABLE revenue_records (
    id UUID PRIMARY KEY,
    record_date DATE NOT NULL,
    category VARCHAR(30) NOT NULL,
    amount_pkr NUMERIC(12, 2) NOT NULL,
    buyer_name VARCHAR(150),
    quantity NUMERIC(12, 2),
    rate_per_unit NUMERIC(10, 2),
    notes TEXT
);

CREATE TABLE expense_records (
    id UUID PRIMARY KEY,
    record_date DATE NOT NULL,
    category VARCHAR(30) NOT NULL,
    amount_pkr NUMERIC(12, 2) NOT NULL,
    vendor VARCHAR(150),
    invoice_number VARCHAR(100),
    notes TEXT
);

CREATE TABLE environment_logs (
    id UUID PRIMARY KEY,
    log_date DATE NOT NULL,
    max_temp_c NUMERIC(5, 2),
    min_temp_c NUMERIC(5, 2),
    humidity_pct NUMERIC(5, 2),
    thi_score NUMERIC(5, 2),
    season VARCHAR(20),
    notes TEXT
);

CREATE TABLE reports_archive (
    id UUID PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    generated_at TIMESTAMP NOT NULL,
    generated_by VARCHAR(120),
    date_from DATE,
    date_to DATE,
    file_path VARCHAR(255),
    parameters TEXT
);

CREATE TABLE system_config (
    id UUID PRIMARY KEY,
    farm_name VARCHAR(150),
    currency VARCHAR(20),
    default_language VARCHAR(20),
    scc_threshold BIGINT,
    weight_trigger_threshold INTEGER,
    ai_service_url VARCHAR(255)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    user_id UUID REFERENCES users(id),
    action VARCHAR(20) NOT NULL,
    entity_type VARCHAR(120),
    entity_id VARCHAR(120),
    old_value TEXT,
    new_value TEXT
);
