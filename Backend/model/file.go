package model

import "github.com/google/uuid"
// import "Backend/database"

type Files struct {
	FileID       uuid.UUID `json:"file_id" gorm:"column:file_id;primaryKey"`
	FileName	 string    `json:"file_name" gorm:"column:file_name"`
	FilePath     string    `json:"file_path" gorm:"column:file_path"`
	FileType	 string    `json:"file_type" gorm:"column:file_type"`
	UserID       uuid.UUID `json:"user_id" gorm:"column:user_id"`
	User         Users     
}

func (Files) TableName() string {
	return "files"
}

// func GetAllFilesbyUserID(userID uuid.UUID) ([]Files, error) {
// 	var fileList []Files
// 	result := database.DB.Where("user_id = ?", userID).Find(&fileList)
// 	return fileList, result.Error
// }