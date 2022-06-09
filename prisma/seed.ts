import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {

    const email = "borkbork@nom.nom";
// Equivalente a eliminar o utilizador caso exista
    const hashedPassword = await bcrypt.hash("qwerty1234", 10);

    // Limpar DB's
    console.log("Limpar a DB SQLITE -------------------------------------------------")
    await prisma.password.deleteMany();
    console.log("Passwords");
    await prisma.image.deleteMany();
    console.log("Image");

    await prisma.contactsOnProfile.deleteMany();
    console.log("ContactOnProfile");
    await prisma.contact.deleteMany();
    console.log("Contact");
    await prisma.profile.deleteMany();
    console.log("Profile");
    await prisma.ticket.deleteMany();
    console.log("Tickets")
    await prisma.userType.deleteMany();
    console.log("userType")
    await prisma.user.deleteMany();
    console.log("User");
    console.log("---------------------------------------------------------------------")


    // Default UserTypes
    // -----------------------------------------------
    // | ID                          | Name          |
    // |-----------------------------|---------------|
    // | cl3ycqrmc0247ca2l92hfqbqv   | Technician    |
    // | cl3ycqrmd0249ca2lv7d7pnri   | Client        |
    // | cl47d037k0031pj2lo2t03gib   | Admin         |
    // -----------------------------------------------
    const userType_Tech = await prisma.userType.create({
        data: {
            id: "cl3ycqrmc0247ca2l92hfqbqv",
            name: "Technician",
        }
    });
    const userType_Client = await prisma.userType.create({
        data: {
            id: "cl3ycqrmd0249ca2lv7d7pnri",
            name: "Client",
        }
    });
    const userType_Admin = await prisma.userType.create({
        data: {
            id: "cl47d037k0031pj2lo2t03gib",
            name: "Admin",
        }
    });

    const user_tech = await prisma.user.create({
       data: {
           email: email,
           password: {
               create:{
                   hash: hashedPassword,
               }
           },
           userType: {
               connect:{
                   name : "Technician",
               }
           },
           profile:{
               create:{
                   first_name: "Bork-Bork",
                   last_name: "Nom-Nom",
                   profilePic: {
                       create: {
                          name: "borkbork-nomnom_profile",
                          url :  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2Fa%2FAATXAJzY05FWFkxKyQxF28iHkGxHTbElWqFAsnnYyA%3Ds900-c-k-c0xffffffff-no-rj-mo&f=1&nofb=1",
                          createdBy: "Bork-Bork",
                       }
                   },
                   contacts: {
                       create: {
                            assignedBy:"Admin",
                            contact: {
                                create: {
                                    email: true,
                                    phone: false,
                                    name: "Email",
                                    info: email,
                                }
                            }
                       }
                   }
               }
           },

       }
    })


    const user_client = await prisma.user.create({
        data: {
            email: "cliente@1.1",
            password: {
                create:{
                    hash: hashedPassword,
                }
            },
            userType: {
                connect:{
                    name : "Client",
                }
            },
            profile:{
                create:{
                    first_name: "Theodor",
                    last_name: "Rex",
                    profilePic: {
                        create: {
                            name: "theodor-rex_profile",
                            url :  "https://randomuser.me/api/portraits/men/72.jpg",
                            createdBy: "theodor-rex",
                        }
                    },
                    contacts: {
                        create: {
                            assignedBy:"Admin",
                            contact: {
                                create: {
                                    email: true,
                                    phone: false,
                                    name: "Email",
                                    info: "cliente@1.1",
                                }
                            }
                        }
                    }
                }
            },

        }
    })


}


seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });