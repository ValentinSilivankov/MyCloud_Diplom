# Облачное хранилище My Cloud online-Storage
Это веб-приложение для управление файлами пользователя, разработанное на Django и React Js.

## Требование 
Убедитесь, что в вашей системе установлены Python и Node js:
- [Python version 3.11.0](https://www.python.org/downloads/release/python-3913/) 
- [Node version 16.17.1](https://nodejs.org/en/download/)

## Запуск приложения на локальном диске

## Установка проекта
1. Клонируем репозиторий в локальную папку:
   ```
   git clone https://github.com/ValentinSilivankov/MyCloud_Diplom.git
   ```

## backend - Django, серверная часть.

2. Открываем папку `MyCloud_Diplom` в любой IDE и запускаем встроенный терминал

3. Создаём виртуальное окружение:
   ```
   python -m venv venv
   ``` 

4. Активируем его:
   ```
   venv\Scripts\activate
   ```

5. Переходим в папку `backend`:
   ```
   cd backend
   ```

6. Устанавливаем зависимости:
   ```
   pip install -r requirements.txt
   ```

7. В папке `backend` создаём файл `.env` в соответствии с шаблоном:
      ```
      # Настройки Django
      SECRET_KEY=*******  # можно сгенерировать на сайте https://djecrety.ir
      DEBUG= #False or True
      ALLOWED_HOSTS=(list) #localhost,127.0.0.1,<ИМЯ ДОМЕНА ИЛИ IP АДРЕС СЕРВЕРА>

      # Настройки базы данных
      DB_HOST=localhost
      DB_PORT=5432
      DB_NAME=your_db
      DB_USER=user
      DB_PASSWORD=password

      # Настройки администратора
      ADMIN_USERNAME=admin
      ADMIN_FIRSTNAME=admin
      ADMIN_LASTNAME=admin
      ADMIN_EMAIL=admin@admin.com
      ADMIN_PASSWORD=admin

      # Базовая папка для хранения файлов
      BASE_STORAGE=storage
      ```

8. Создаём базу данных с учётом настроек указанных в файле `.env`:
   `createdb -U <DB_USER> <DB_NAME>` Пароль: `<DB_PASSWORD>`

9. Применяем миграции:
   ```
   python manage.py migrate
   ```

10. Создаём суперпользователя с указанными в файле `.env` данными:
   ```
   python manage.py create_superuser
   ```

11. Запускаем сервер:
   ```
   python manage.py runserver
   ```

После этого переходите по ссылке [127.0.0.1:8000](http://127.0.0.1:8000/admin/), вы увидите главную страницу.

## frontend - React App, клиенская  часть.

12. Открываем второй терминал в директории `frontend`
   ```
   cd frontend
   ```

13. В файле `.env` указываем базовый URL сервера:
   ```
   VITE_SERVER_URL=http://localhost:8000/api
   ```

14. Устанавливаем необходимые зависимости:
   ```
   npm install
   ```

15. Запускаем приложение:
   ```
   npm run dev
   ```

После запуска  вы можете получить доступ к приложению на http://localhost:5000/