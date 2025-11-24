package controller

import (
	"Backend/model"
	"time"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Registrasi(c *gin.Context) {
	var input RegisterPayload
	c.BindJSON(&input)

	hasilcek, err := model.CekEmailTerdaftar(input.Email)

	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Terjadi kesalahan pada server"})
        return
    }
    if hasilcek { 
         c.JSON(400, gin.H{"error": "Email sudah terdaftar"})
         return
    }
	
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal hash password"})
		return
	}
	newUser := model.Users{
		UserID:   uuid.New(),            // Generate UUID baru
		Username: input.Username,
		Email:    input.Email,
		Password: string(hashedPassword), // Masukkan hasil HASH, bukan payload.Password
	}

	 model.Registrasi(newUser)
	c.JSON(200, gin.H{"message": "Registrasi berhasil"})
}

func Login (c *gin.Context){
	var input LoginPayload
	c.BindJSON(&input)

	user, err := model.FindUserbyEmail(input.Email)

	if err != nil {
		c.JSON(404, gin.H{"error": "Email atau password salah"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(404, gin.H{"error": "Email atau password salah"})
		return
	}

	// Buat token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
		jwt.MapClaims{
			"user_id": user.UserID,
			"email":   user.Email,
			"exp":    jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
		})

	
	JWTKey := os.Getenv("JWTKey")
	accessToken, err := token.SignedString([]byte(JWTKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat token"})
		return
	}

	c.JSON(200, gin.H{
		"message": "Login berhasil",
		"token":   accessToken,
		"user":    gin.H{"user_id": user.UserID, "username": user.Username, "email": user.Email},
	})
}
