package middleware

import (
	"net/http"
)

var CORS = func(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")
		w.Header().Add("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Add("X-Frame-Options", "DENY")

		if r.Method == http.MethodOptions {

		} else {
			next.ServeHTTP(w, r)
		}
	})
}
