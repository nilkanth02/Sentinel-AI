"""
Database migration script to add audit logging columns to risk_logs table.

Run this script to update the database schema with new audit columns:
- decision
- decision_reason  
- signals
"""

import sqlite3
import sys
import os

def migrate_database():
    """Add audit logging columns to risk_logs table."""
    
    # Database path
    db_path = "sentinel_ai.db"
    
    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        print("Please ensure the database exists before running migration.")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(risk_logs)")
        columns = [row[1] for row in cursor.fetchall()]
        
        # Columns to add
        migrations = []
        
        if "decision" not in columns:
            migrations.append("ADD COLUMN decision TEXT NOT NULL DEFAULT 'unknown'")
        
        if "decision_reason" not in columns:
            migrations.append("ADD COLUMN decision_reason TEXT NOT NULL DEFAULT 'No reason provided'")
        
        if "signals" not in columns:
            migrations.append("ADD COLUMN signals TEXT NOT NULL DEFAULT '[]'")
        
        # Execute migrations
        for migration in migrations:
            alter_sql = f"ALTER TABLE risk_logs {migration}"
            print(f"Executing: {alter_sql}")
            cursor.execute(alter_sql)
        
        # Commit changes
        conn.commit()
        
        # Verify the changes
        cursor.execute("PRAGMA table_info(risk_logs)")
        updated_columns = [row[1] for row in cursor.fetchall()]
        
        print(f"Migration completed successfully!")
        print(f"Updated columns: {updated_columns}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("Starting database migration...")
    success = migrate_database()
    
    if success:
        print("✅ Migration completed successfully!")
        print("Restart the SentinelAI server to enable audit logging.")
    else:
        print("❌ Migration failed. Please check the error above.")
        sys.exit(1)
