package database

import (
	"log"
	"os"
	"gorm.io/gorm" 
    "gorm.io/driver/postgres"
    
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL") // Supabase juga pakai URL Postgres
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: false,
	})

	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	DB = db
	log.Println("Database connected successfully!")
}