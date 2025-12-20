package model


import (
	"time"
	"github.com/google/uuid"
)


type Files struct {
	FileID       uuid.UUID `json:"file_id" gorm:"column:file_id;primaryKey"`
	FileName	 string    `json:"file_name" gorm:"column:file_name"`
	FilePath     string    `json:"file_path" gorm:"column:file_path"`
	FileType	 string    `json:"file_type" gorm:"column:file_type"`
	FileSize     int64      `json:"file_size" gorm:"column:file_size"`
	CreatedAt    time.Time `json:"created_at" gorm:"column:created_at"`
	UserID       uuid.UUID `json:"user_id" gorm:"column:user_id"`
	User         Users     `json:"-"`
}

func (Files) TableName() string {
	return "files"
}

