package model

import "Backend/database"


func Registrasi(user Users) error {
	result := database.DB.Create(&user)
	return result.Error
}

func CekEmailTerdaftar(email string) (bool, error) {
	var user Users
	result := database.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}