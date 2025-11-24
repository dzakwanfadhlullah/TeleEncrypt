package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5" 
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Ambil Header Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header diperlukan"})
			c.Abort()
			return
		}

		// 2. Cek format "Bearer <token>"
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Format token salah. Gunakan Bearer <token>"})
			c.Abort()
			return
		}

		// 3. Parse Token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validasi algoritma signing
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("metode signing tidak valid: %v", token.Header["alg"])
			}
			// Ambil Secret Key dari .env
			return []byte(os.Getenv("JWTKey")), nil
		})

		// 4. Validasi Token & Ekstrak Claims
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid atau kadaluarsa"})
			c.Abort()
			return
		}

		// 5. Simpan Data ke Context
		// Claims adalah data payload (user_id, email, exp)
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// Simpan user_id ke context agar bisa diambil di Controller
			// Catatan: JSON number biasanya jadi float64, perlu konversi jika perlu
			c.Set("user_id", claims["user_id"])
			c.Set("email", claims["email"])
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Gagal memproses klaim token"})
			c.Abort()
			return
		}

		// Lanjut ke handler berikutnya
		c.Next()
	}
}