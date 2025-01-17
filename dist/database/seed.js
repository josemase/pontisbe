import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    // Clears all data
    await prisma.media.deleteMany();
    await prisma.story.deleteMany();
    await prisma.family.deleteMany();
    await prisma.profile.deleteMany();
    // User is already created in auth0
    // User ID: auth0|66e5d945bea7e35541d9b7cf
    // email: awspontis@gmail.com
    // password: password123!
    const introContent = "We gather here to honor and celebrate the life of our beloved Gertrude May, a remarkable woman whose warmth, kindness, and unwavering love touched each of us deeply. As we remember her incredible journey, we invite you to explore this memorial page, filled with cherished memories and moments that capture the essence of who she was. Please feel free to leave a loving note, share a fond memory, or express your condolences. Your messages will be a source of comfort and a testament to the profound impact Gertrude had on all our lives.";
    const profile = await prisma.profile.create({
        data: {
            id: "be1f1910-b934-4044-9b52-5f37b3097b37",
            firstName: "Gertrude",
            lastName: "Hanson",
            birthDate: new Date("1932-06-05"),
            deathDate: new Date("2024-01-24"),
            birthState: "Highland, UT",
            birthCountry: "Highland, UT",
            introduction: introContent,
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
    const story1 = "In our family, every Easter Sunday, we celebrate a unique and whimsical tradition known as the Great Bubblegum Hunt. This tradition, started by my grandmother, has been a source of laughter and joy for generations. The origins of the Great Bubblegum Hunt date back to the 1950s when my grandmother, then a young mother with a playful spirit, decided to add a twist to the Easter egg hunt. Instead of hiding eggs, she chose brightly colored bubblegum in various flavors. She believed that hunting for bubblegum would bring a sweet surprise and an element of fun that eggs simply couldn't match. On Easter morning, the family gathers in my grandmother's garden, where she has meticulously hidden dozens of pieces of bubblegum. The garden, with its blooming flowers and lush greenery, becomes a treasure trove of candy delights. Each piece of bubblegum is wrapped in vibrant foil, making the hunt both visually appealing and exciting for the children and adults alike. The rules of the Great Bubblegum Hunt are simple but full of good-hearted competition. Each participant, armed with a small basket, searches high and low for as many pieces of bubblegum as they can find. The hunt is not just about who collects the most bubblegum, but also about the camaraderie and laughter that ensue as family members scramble to uncover the hidden treats. One of the highlights of the tradition is the special Golden Bubblegum, a rare piece wrapped in gold foil. Finding the Golden Bubblegum is considered a great honor and brings with it a small prize, usually a gift card or a special homemade treat from my grandmother's kitchen. The lucky finder is also crowned the Bubblegum King or Queen for the day, wearing a playful, makeshift crown and receiving a round of applause from the family. After the hunt, the family gathers for a picnic brunch, sharing stories and enjoying the sweet spoils of their search. The younger children often trade bubblegum flavors, while the adults reminisce about past hunts and the amusing antics that have occurred over the years. The air is filled with the scent of blooming flowers and the cheerful sounds of family togetherness. The Great Bubblegum Hunt is more than just a fun activity; it symbolizes the creativity and joy that my grandmother brought into our lives. It is a testament to her ability to turn ordinary moments into extraordinary memories. Though she is no longer with us, her spirit lives on every Easter as we continue this cherished family tradition, reminding us of the importance of fun, family, and a little bit of sweet surprise.";
    await prisma.story.createMany({
        data: [
            {
                title: "Easter Traditions",
                content: story1,
                biographySection: "Infancy",
                date: 1934,
                profileId: profile.id
            },
            {
                title: "Summer Adventures",
                content: "This is my story",
                biographySection: "Childhood",
                date: 1943,
                profileId: profile.id
            },
            {
                title: "Winter Wonders",
                content: "This is my story",
                biographySection: "Teenage Years",
                date: 1948,
                profileId: profile.id
            },
            {
                title: "Springtime Memories",
                content: "This is my story",
                biographySection: "Young Adult",
                date: 1952,
                profileId: profile.id
            },
            {
                title: "Autumn Reflections",
                content: "This is my story",
                biographySection: "Adulthood",
                date: 1990,
                profileId: profile.id
            },
            {
                title: "A Life Well Lived",
                content: "This is my story",
                biographySection: "End of Life",
                date: 2020,
                profileId: profile.id
            }
        ]
    });
    const createdStories = await prisma.story.findMany({
        where: {
            profileId: profile.id
        },
        orderBy: {
            date: "asc" // Order them the same way they were created
        }
    });
    await prisma.media.createMany({
        data: [
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647.png",
                profileId: profile.id,
                storyId: createdStories[0].id,
                biographySection: "Infancy",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-1.png",
                profileId: profile.id,
                storyId: createdStories[0].id,
                biographySection: "Childhood",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-2.png",
                profileId: profile.id,
                storyId: createdStories[1].id,
                biographySection: "Teenage Years",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-3.png",
                profileId: profile.id,
                storyId: createdStories[1].id,
                biographySection: "Young Adult",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-4.png",
                profileId: profile.id,
                storyId: createdStories[2].id,
                biographySection: "Adulthood",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-5.png",
                profileId: profile.id,
                storyId: createdStories[2].id,
                biographySection: "End of Life",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-6.png",
                profileId: profile.id,
                storyId: createdStories[3].id,
                biographySection: "Infancy",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-7.png",
                profileId: profile.id,
                storyId: createdStories[3].id,
                biographySection: "Childhood",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-8.png",
                profileId: profile.id,
                storyId: createdStories[4].id,
                biographySection: "Teenage Years",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-9.png",
                profileId: profile.id,
                storyId: createdStories[4].id,
                biographySection: "Young Adult",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-10.png",
                profileId: profile.id,
                storyId: createdStories[5].id,
                biographySection: "Adulthood",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-11.png",
                profileId: profile.id,
                storyId: createdStories[5].id,
                biographySection: "End of Life",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-12.png",
                profileId: profile.id,
                biographySection: "Infancy",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-13.png",
                profileId: profile.id,
                biographySection: "Childhood",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-14.png",
                profileId: profile.id,
                biographySection: "Teenage Years",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-15.png",
                profileId: profile.id,
                biographySection: "Young Adult",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-16.png",
                profileId: profile.id,
                biographySection: "Adulthood",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-17.png",
                profileId: profile.id,
                biographySection: "End of Life",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-18.png",
                profileId: profile.id,
                biographySection: "Infancy",
                mediaType: "image"
            },
            {
                media: "auth0|66e5d945bea7e35541d9b7cf/be1f1910-b934-4044-9b52-5f37b3097b37/gallery/Rectangle 1647-19.png",
                profileId: profile.id,
                biographySection: "Childhood",
                mediaType: "image"
            }
        ]
    });
    await prisma.family.createMany({
        data: [
            {
                fullName: "John May",
                relation: "Spouse",
                profileId: profile.id
            },
            {
                fullName: "Martha May",
                relation: "Child",
                profileId: profile.id
            },
            {
                fullName: "Missy May",
                relation: "Child",
                profileId: profile.id
            },
            {
                fullName: "Timothee May",
                relation: "Child",
                profileId: profile.id
            },
            {
                fullName: "Jacob May",
                relation: "Child",
                profileId: profile.id
            }
        ]
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
//# sourceMappingURL=seed.js.map