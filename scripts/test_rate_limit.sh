for i in {1..12}; do
   echo "Wrong login try $i..."
   curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3001/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@test.com", "password": "wrongpassword"}'
done

