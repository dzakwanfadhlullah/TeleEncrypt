package model

import "github.com/google/uuid"
import "Backend/database"

type Users struct {
    UserID       uuid.UUID `json:"user_id" gorm:"column:user_id;primaryKey;type:uuid"`
    Username     string    `json:"username" gorm:"column:username"`
    Email        string    `json:"email" gorm:"column:email"`
    Password     string    `json:"password_hash" gorm:"column:password_hash"`
}

func (Users) TableName() string {
    return "users"
}



func GetAllUsers() ([]Users, error) {
    var userList []Users
    result := database.DB.Find(&userList)
    return userList, result.Error
}

func FindUserbyEmail(email string) (Users, error) {
    var user Users
    result := database.DB.Where("email = ?", email).First(&user)
    
    return user, result.Error
}
