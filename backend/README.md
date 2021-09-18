## Cara run Backend

1.  Install node js
2.  Install yarn
3.  Setup file .env
    | env | deskripsi |
    |------------|----------------|
    | PORT | Port dimana backend server berjalan |
    | DATABASE_URL | URL database |
    | COMPILER_URL | URL service compiler |
    | SECRET_TOKEN | Secret token jwt vlab |
    | REFRESH_TOKEN | Refresh token jwt vlab |
    | ETHOL_SECRET_TOKEN | Secret token jwt dari ETHOL untuk autentikasi pembacaan cookies dari ETHOL |
4.  Run

```sh
npx prisma migrate deploy
```

5.  Run

```sh
yarn install
yarn start
```
