package model

import "github.com/google/uuid"
import "Backend/database"
import storage_go "github.com/supabase-community/storage-go"
import "os"

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	
)

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

var (
	supabaseUrl    = os.Getenv("SUPABASE_URL")
	supabaseKey    = os.Getenv("SUPABASE_KEY") 
	storageBucket  = "file_uploaded"        
)

// func GetAllFilesbyUserID(userID uuid.UUID) ([]Files, error) {
// 	var fileList []Files
// 	result := database.DB.Where("user_id = ?", userID).Find(&fileList)
// 	return fileList, result.Error
// }

func UploadAndSaveFile(fileHeader *multipart.FileHeader, file multipart.File, userID uuid.UUID) (*Files, error) {
	
	// 1. Inisialisasi Client Storage
	// Link storage biasanya: https://project-id.supabase.co/storage/v1
	storageURL := fmt.Sprintf("%s/storage/v1", supabaseUrl)
	client := storage_go.NewClient(storageURL, supabaseKey, nil)

	// 2. Buat Nama File Unik (UUID + Extension)
	// Agar jika user upload file dengan nama sama, tidak tertimpa
	ext := filepath.Ext(fileHeader.Filename)
	newFileName := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	
	// Path penyimpanan di bucket: user_id/nama_file
	filePath := fmt.Sprintf("%s/%s", userID.String(), newFileName)

	// 3. Deteksi Content-Type
	contentType := fileHeader.Header.Get("Content-Type")

	// 4. Upload ke Supabase Storage
	// Upsert: false (tidak menimpa file yang ada)
	_, err := client.UploadFile(storageBucket, filePath, file, storage_go.FileOptions{
		ContentType: &contentType,
	})

	if err != nil {
		return nil, fmt.Errorf("gagal upload ke supabase: %v", err)
	}

	// 5. Dapatkan Public URL (Opsional, jika bucket public)
	publicURL := client.GetPublicUrl(storageBucket, filePath).SignedURL

	// 6. Simpan Metadata ke Database (GORM)
	newFileRecord := Files{
		FileID:   uuid.New(),
		FileName: fileHeader.Filename, // Nama asli file
		FilePath: publicURL,           // Atau simpan 'filePath' saja tergantung kebutuhan
		FileType: contentType,
		UserID:   userID,
	}

	// Simpan ke tabel 'files'
	// Asumsi variable 'database.DB' adalah *gorm.DB yang sudah connect
	if err := database.DB.Create(&newFileRecord).Error; err != nil {
		return nil, fmt.Errorf("gagal menyimpan ke database: %v", err)
	}

	return &newFileRecord, nil
}

func GetFilesByUserID(userID uuid.UUID) ([]Files, error) {
	var files []Files
	
	// Query GORM: SELECT * FROM files WHERE user_id = '...'
	result := database.DB.Where("user_id = ?", userID).Find(&files)
	
	if result.Error != nil {
		return nil, result.Error
	}
	
	return files, nil
}
