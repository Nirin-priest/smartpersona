This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Database Setup & Maintenance (การจัดการฐานข้อมูล)

โปรเจกต์นี้ใช้ Docker สำหรับจัดการฐานข้อมูล MySQL เพื่อความสะดวกในการแชร์โค้ดและการใช้งาน

### 1. การเริ่มต้นใช้งานครั้งแรก (For New Cloners)
หลังจาก Clone โปรเจกต์มาแล้ว ให้รันคำสั่งนี้เพื่อสร้าง Container และเริ่มต้นฐานข้อมูลจากไฟล์ `init.sql`:
```bash
docker compose -f docker-compose-mysql-phpmyadmin.yaml up -d
```
*   **MySQL**: `localhost:3306` (User: `root`, Password: `root`)
*   **phpMyAdmin**: [http://localhost:8080](http://localhost:8080)

### 2. การอัปเดตฐานข้อมูล (For Developers)
หากคุณมีการลบ/เพิ่มตาราง หรือแก้ไขข้อมูลใน Database และต้องการให้คนอื่นเห็นการเปลี่ยนแปลงด้วย ให้ทำตามขั้นตอนดังนี้:

1.  รันคำสั่งเพื่อเขียนข้อมูลปัจจุบันลงไฟล์ `database/init.sql`:
    ```bash
    npm run db:dump
    ```
2.  Commit ไฟล์ `database/init.sql` ที่ถูกอัปเดตแล้วขึ้น Git ทุกครั้ง

### 3. การรีเซ็ตฐานข้อมูล (Resetting)
หากข้อมูลเละเทะและต้องการเริ่มใหม่จากไฟล์ `init.sql` ต้นฉบับ:
1.  หยุดการทำงาน: `docker compose -f docker-compose-mysql-phpmyadmin.yaml down`
2.  ลบโฟลเดอร์ `mysql-data` (ข้อมูลดิบจะถูกลบทั้งหมด)
3.  รันใหม่: `docker compose -f docker-compose-mysql-phpmyadmin.yaml up -d`

---

## Getting Started (Next.js)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
