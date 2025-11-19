package model

import "github.com/google/uuid"
import "Backend/database"

type users struct {
    UserID       uuid.UUID `json:"user_id" gorm:"column:user_id;primaryKey;type:uuid"`
    Username     string    `json:"username" gorm:"column:username"`
    Email        string    `json:"email" gorm:"column:email"`
    PasswordHash string    `json:"password_hash" gorm:"column:password_hash"`
}

func (users) TableName() string {
    return "users"
}

func GetAllUsers() ([]users, error) {
    var userList []users
    result := database.DB.Find(&userList)
    return userList, result.Error
}
