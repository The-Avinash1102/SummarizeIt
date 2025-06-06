CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email varchar(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fullname varchar(255),
    customer_id varchar(255) UNIQUE,
    price_id varchar(255),
    status varchar(50) DEFAULT 'inactive'
);

CREATE TABLE pdf_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id varchar(255) NOT NULL,
    original_file_url TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    status varchar(50) DEFAULT 'completed',
    title TEXT,
    file_name TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount INTEGER NOT NULL,
    status varchar(50) NOT NULL,
    stripe_payment_id varchar(255) UNIQUE NOT NULL,
    price_id varchar(255) NOT NULL,
    email varchar(255) NOT NULL REFERENCES users(email),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_summaries_updated_at
  BEFORE UPDATE ON pdf_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();