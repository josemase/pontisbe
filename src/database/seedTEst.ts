import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {


    const profile = await prisma.profile.create({
    data: {
        id: "11111111-b934-4044-9b52-5f37b3097b37",
        fullName: "Gertrude May",
        birthDate: new Date("1932-06-05"),
        deathDate: new Date("2024-01-24"),
        birthState: "Minnesota",
        birthCountry: "USA",
        birthCity: "Minneapolis",
        deathState: "California",
        deathCountry: "USA",
        deathCity: "Los Angeles",
        introduction: "introContent",
        interests: [1, 2, 3, 4, 5],
        profileImages: [
            "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/image 20.png",
            "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/image 37.png",
            "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/image 38.png",
            "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/image 39.png",
            "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/image 40.png",
            "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/image 41.png"
        ],
        userId: "auth0|66e5d945bea7e35541d9b7cf",
        religion: "Christian"
    }
});
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });