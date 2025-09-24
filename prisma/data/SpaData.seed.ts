import { Gender, ServiceCategory, type PrismaClient } from "@prisma/client";

export default async function SpaDataSeeder(db: PrismaClient) {
  // Create Services
  const services = [
    {
      id: 1,
      name: "Traditional Balinese Massage",
      description: "Full body relaxing massage with traditional Balinese techniques",
      price: 350000,
      duration: 90,
      category: ServiceCategory.MASSAGE
    },
    {
      id: 2,
      name: "Deep Tissue Massage",
      description: "Therapeutic massage focusing on deeper layers of muscle",
      price: 400000,
      duration: 60,
      category: ServiceCategory.MASSAGE
    },
    {
      id: 3,
      name: "Hydrating Facial",
      description: "Moisturizing facial treatment for dry skin",
      price: 250000,
      duration: 75,
      category: ServiceCategory.FACIAL
    },
    {
      id: 4,
      name: "Anti-Aging Facial",
      description: "Advanced facial treatment to reduce signs of aging",
      price: 450000,
      duration: 90,
      category: ServiceCategory.FACIAL
    },
    {
      id: 5,
      name: "Hot Stone Massage",
      description: "Relaxing massage using heated stones",
      price: 500000,
      duration: 120,
      category: ServiceCategory.MASSAGE
    },
    {
      id: 6,
      name: "Body Scrub & Wrap",
      description: "Exfoliating body treatment with moisturizing wrap",
      price: 300000,
      duration: 90,
      category: ServiceCategory.BODY_TREATMENT
    },
    {
      id: 7,
      name: "Manicure & Pedicure",
      description: "Complete nail care for hands and feet",
      price: 150000,
      duration: 60,
      category: ServiceCategory.NAIL_CARE
    },
    {
      id: 8,
      name: "Hair Treatment & Styling",
      description: "Hair treatment with professional styling",
      price: 200000,
      duration: 90,
      category: ServiceCategory.HAIR_TREATMENT
    }
  ];

  for (const service of services) {
    const { id, ...data } = service;

    await db.service.upsert({
      where: { id },
      update: data,
      create: data
    });
  }

  // Create Employees
  const employees = [
    {
      id: 1,
      name: "Sari Dewi",
      email: "sari.dewi@kalimasada.com",
      phone: "+62812345678901",
      position: "Senior Therapist",
      salary: 4500000,
      hireDate: new Date("2023-01-15")
    },
    {
      id: 2,
      name: "Made Wirawan",
      email: "made.wirawan@kalimasada.com",
      phone: "+62812345678902",
      position: "Massage Therapist",
      salary: 3500000,
      hireDate: new Date("2023-03-20")
    },
    {
      id: 3,
      name: "Kadek Ayu",
      email: "kadek.ayu@kalimasada.com",
      phone: "+62812345678903",
      position: "Facial Specialist",
      salary: 4000000,
      hireDate: new Date("2023-02-10")
    },
    {
      id: 4,
      name: "Wayan Suarta",
      email: "wayan.suarta@kalimasada.com",
      phone: "+62812345678904",
      position: "Receptionist",
      salary: 3000000,
      hireDate: new Date("2023-01-05")
    },
    {
      id: 5,
      name: "Ni Luh Putu",
      email: "niluh.putu@kalimasada.com",
      phone: "+62812345678905",
      position: "Nail Technician",
      salary: 3200000,
      hireDate: new Date("2023-04-01")
    }
  ];

  for (const employee of employees) {
    const { id, ...data } = employee;

    await db.employee.upsert({
      where: { id },
      update: data,
      create: data
    });
  }

  // Create Customers
  const customers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+62812345671001",
      address: "Jl. Sunset Road No. 123, Seminyak",
      birthDate: new Date("1985-06-15"),
      gender: Gender.FEMALE
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+62812345671002",
      address: "Jl. Monkey Forest Road No. 45, Ubud",
      birthDate: new Date("1978-11-22"),
      gender: Gender.MALE
    },
    {
      id: 3,
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phone: "+62812345671003",
      address: "Jl. Pantai Kuta No. 78, Kuta",
      birthDate: new Date("1992-03-08"),
      gender: Gender.FEMALE
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "+62812345671004",
      address: "Jl. Raya Sanur No. 234, Sanur",
      birthDate: new Date("1980-09-12"),
      gender: Gender.MALE
    },
    {
      id: 5,
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      phone: "+62812345671005",
      address: "Jl. Laksmana No. 567, Seminyak",
      birthDate: new Date("1988-12-25"),
      gender: Gender.FEMALE
    }
  ];

  for (const customer of customers) {
    const { id, ...data } = customer;

    await db.customer.upsert({
      where: { id },
      update: data,
      create: data
    });
  }

  console.log("✅ Spa & Salon seed data created successfully");
}
