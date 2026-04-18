-- Smart Event Management System - Initial Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    college_id VARCHAR(50),
    qr_code TEXT UNIQUE,
    credit_score INTEGER DEFAULT 100,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('superadmin', 'admin', 'volunteer', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    registration_open BOOLEAN DEFAULT TRUE,
    registration_close_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled'))
);

-- REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE,
    seat_number VARCHAR(10),
    food_status VARCHAR(50) DEFAULT 'eligible' CHECK (food_status IN ('eligible', 'collected', 'not_eligible')),
    food_collected_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, event_id)
);

-- CREDIT HISTORY TABLE
CREATE TABLE IF NOT EXISTS credit_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    change_amount INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FOOD BATCHES TABLE
CREATE TABLE IF NOT EXISTS food_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    batch_number INTEGER NOT NULL,
    batch_size INTEGER DEFAULT 10,
    notified_at TIMESTAMP WITH TIME ZONE,
    window_close_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'notified' CHECK (status IN ('notified', 'in_progress', 'done'))
);

-- SEAT CHANGE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS seat_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    current_seat VARCHAR(10) NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    new_seat VARCHAR(10)
);

-- EHSAAS QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS ehsaas_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Null for anonymous
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Technical', 'General', 'Personal', 'Other')),
    mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'reported')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- VOLUNTEER LOGS TABLE
CREATE TABLE IF NOT EXISTS volunteer_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    student_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    gate VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- APPEALS TABLE
CREATE TABLE IF NOT EXISTS appeals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    credit_history_id UUID REFERENCES credit_history(id) ON DELETE CASCADE,
    reason VARCHAR(50) CHECK (reason IN ('Medical', 'Emergency', 'Technical issue', 'Other')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);
