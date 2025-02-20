-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventImages" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT DEFAULT 'https://res.cloudinary.com/dha7ofrer/image/upload/v1738293176/kgg4vvc27a1uf9ep6eef.jpg';
