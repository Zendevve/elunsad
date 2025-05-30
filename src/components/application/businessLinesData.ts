export interface BusinessLineOption {
  category: string;
  name: string;
  products: string[];
}

export const businessLinesData: BusinessLineOption[] = [
  // RETAIL
  {
    category: "RETAIL",
    name: "General Merchandise / Sari-Sari Store",
    products: [
      "Groceries (canned goods, noodles, rice)",
      "Snacks & Beverages",
      "Toiletries",
      "School Supplies",
      "Prepaid Load",
      "Household Cleaning Supplies",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Convenience Store",
    products: [
      "Ready-to-eat meals",
      "Snacks",
      "Beverages (hot & cold)",
      "Basic Groceries",
      "Personal Care Items",
      "Magazines",
      "Over-the-counter medicine",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Clothing & Apparel Store / Boutique",
    products: [
      "Men's Wear",
      "Women's Wear",
      "Children's Wear",
      "Fashion Accessories",
      "Shoes",
      "Bags",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Electronics & Gadget Store",
    products: [
      "Mobile Phones",
      "Laptops",
      "Tablets",
      "Computer Accessories",
      "Audio Equipment",
      "Smart Home Devices",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Hardware Store",
    products: [
      "Building Materials (cement, sand, gravel)",
      "Plumbing Supplies",
      "Electrical Supplies",
      "Paints",
      "Tools",
      "Lumber",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Pharmacy / Drugstore",
    products: [
      "Prescription Medicines",
      "Over-the-counter Drugs",
      "Vitamins & Supplements",
      "Medical Supplies",
      "Personal Hygiene Products",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Bookstore & Office Supplies",
    products: [
      "Books (fiction, non-fiction, textbooks)",
      "School Supplies",
      "Office Stationery",
      "Art Supplies",
      "Magazines & Newspapers",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Pet Shop",
    products: [
      "Pet Food",
      "Pet Accessories (collars, leashes, toys)",
      "Pet Cages/Beds",
      "Pet Grooming Supplies",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Bakery / Bakeshop (Retail Only)",
    products: [
      "Bread (pandesal, loaf)",
      "Cakes",
      "Pastries",
      "Cookies",
      "Pies",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Rice Retailing",
    products: [
      "Sinandomeng Rice",
      "Dinorado Rice",
      "Brown Rice",
      "Jasmine Rice",
      "Basmati Rice",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Meat Shop / Poultry & Meat Dealer",
    products: [
      "Pork",
      "Beef",
      "Chicken",
      "Processed Meats (sausages, tocino)",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Fishmonger / Seafood Dealer",
    products: [
      "Fresh Fish",
      "Shrimp",
      "Crabs",
      "Shellfish",
      "Other Seafood",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Fruit & Vegetable Stall",
    products: [
      "Local Fruits",
      "Imported Fruits",
      "Leafy Vegetables",
      "Root Crops",
      "Herbs & Spices",
      "Others (Custom)"
    ]
  },
  {
    category: "RETAIL",
    name: "Online Retailer / E-commerce",
    products: [
      "Fashion Items",
      "Electronics",
      "Home Goods",
      "Beauty Products",
      "Books & Media",
      "Others (Custom)"
    ]
  },
  
  // FOOD & BEVERAGE SERVICE
  {
    category: "FOOD & BEVERAGE SERVICE",
    name: "Restaurant / Fine Dining",
    products: [
      "Filipino Cuisine",
      "Italian Cuisine",
      "Japanese Cuisine",
      "Ala Carte Menu",
      "Set Menus",
      "Dine-in Service",
      "Alcoholic Beverages",
      "Others (Custom)"
    ]
  },
  {
    category: "FOOD & BEVERAGE SERVICE",
    name: "Fast Food / Quick Service Restaurant",
    products: [
      "Burgers",
      "Fried Chicken",
      "Fries",
      "Soft Drinks",
      "Packaged Meals",
      "Dine-in Service",
      "Take-out Service",
      "Others (Custom)"
    ]
  },
  {
    category: "FOOD & BEVERAGE SERVICE",
    name: "Cafe / Coffee Shop",
    products: [
      "Coffee (brewed, espresso-based)",
      "Tea",
      "Pastries",
      "Sandwiches",
      "Light Meals",
      "Non-coffee Beverages",
      "Others (Custom)"
    ]
  },
  {
    category: "FOOD & BEVERAGE SERVICE",
    name: "Carinderia / Eatery",
    products: [
      "Pre-cooked Filipino dishes (turo-turo)",
      "Rice meals",
      "Soft drinks",
      "Dine-in Service",
      "Others (Custom)"
    ]
  },
  {
    category: "FOOD & BEVERAGE SERVICE",
    name: "Food Kiosk / Food Stall / Food Cart",
    products: [
      "Shawarma",
      "Fries",
      "Siomai",
      "Fruit Shakes",
      "Street Food",
      "Others (Custom)"
    ]
  },
  {
    category: "FOOD & BEVERAGE SERVICE",
    name: "Bar / Pub",
    products: [
      "Beer",
      "Wine",
      "Spirits",
      "Cocktails",
      "Non-alcoholic Beverages",
      "Bar Chow/Appetizers",
      "Others (Custom)"
    ]
  },
  {
    category: "FOOD & BEVERAGE SERVICE",
    name: "Catering Services",
    products: [
      "Food preparation & service for events",
      "Buffet setup",
      "Plated meals",
      "Event Coordination",
      "Others (Custom)"
    ]
  },
  {
    category: "FOOD & BEVERAGE SERVICE",
    name: "Milk Tea Shop / Beverage Stand",
    products: [
      "Milk Tea (various flavors)",
      "Fruit Tea",
      "Smoothies",
      "Juices",
      "Coffee-based Frappes",
      "Others (Custom)"
    ]
  },

  // PERSONAL SERVICES
  {
    category: "PERSONAL SERVICES",
    name: "Salon / Barber Shop",
    products: [
      "Haircut",
      "Hair Styling",
      "Hair Color",
      "Hair Treatment",
      "Manicure",
      "Pedicure",
      "Shave",
      "Others (Custom)"
    ]
  },
  {
    category: "PERSONAL SERVICES",
    name: "Spa / Wellness Center",
    products: [
      "Massage Therapy",
      "Body Scrubs",
      "Facials",
      "Sauna",
      "Aromatherapy",
      "Others (Custom)"
    ]
  },
  {
    category: "PERSONAL SERVICES",
    name: "Laundry Shop / Laundromat",
    products: [
      "Washing",
      "Drying",
      "Folding",
      "Pressing/Ironing",
      "Dry Cleaning",
      "Others (Custom)"
    ]
  },
  {
    category: "PERSONAL SERVICES",
    name: "Pet Grooming Services",
    products: [
      "Pet Bathing",
      "Hair Trimming",
      "Nail Clipping",
      "Ear Cleaning for pets",
      "Others (Custom)"
    ]
  },
  {
    category: "PERSONAL SERVICES",
    name: "Tutorial Center",
    products: [
      "Academic Tutoring (Math, Science, English)",
      "Test Review (College Entrance, Licensure)",
      "Language Classes",
      "Others (Custom)"
    ]
  },
  {
    category: "PERSONAL SERVICES",
    name: "Photography / Videography Services",
    products: [
      "Event Coverage (weddings, birthdays)",
      "Portrait Photography",
      "Product Photography",
      "Video Production",
      "Photo/Video Editing",
      "Others (Custom)"
    ]
  },

  // REPAIR & MAINTENANCE SERVICES
  {
    category: "REPAIR & MAINTENANCE SERVICES",
    name: "Automotive Repair Shop",
    products: [
      "Engine Repair",
      "Oil Change",
      "Brake Service",
      "Tire Services",
      "Electrical Repair",
      "Body Repair & Painting",
      "Others (Custom)"
    ]
  },
  {
    category: "REPAIR & MAINTENANCE SERVICES",
    name: "Motorcycle Repair Shop",
    products: [
      "Engine Overhaul",
      "Tune-up",
      "Parts Replacement",
      "Tire Vulcanizing",
      "Others (Custom)"
    ]
  },
  {
    category: "REPAIR & MAINTENANCE SERVICES",
    name: "Electronics Repair Shop (Computer, Phone, Appliances)",
    products: [
      "Computer Repair",
      "Laptop Repair",
      "Mobile Phone Repair",
      "TV Repair",
      "Appliance Repair",
      "Others (Custom)"
    ]
  },
  {
    category: "REPAIR & MAINTENANCE SERVICES",
    name: "Watch Repair / Jewelry Repair",
    products: [
      "Battery Replacement",
      "Strap Replacement",
      "Movement Repair",
      "Jewelry Cleaning",
      "Stone Setting",
      "Others (Custom)"
    ]
  },
  {
    category: "REPAIR & MAINTENANCE SERVICES",
    name: "Plumbing Services",
    products: [
      "Leak Repair",
      "Drain Cleaning",
      "Fixture Installation (sinks, toilets)",
      "Pipe Installation",
      "Others (Custom)"
    ]
  },
  {
    category: "REPAIR & MAINTENANCE SERVICES",
    name: "Electrical Services",
    products: [
      "Wiring Installation",
      "Outlet Repair",
      "Lighting Fixture Installation",
      "Electrical Troubleshooting",
      "Others (Custom)"
    ]
  },
  {
    category: "REPAIR & MAINTENANCE SERVICES",
    name: "Aircon Cleaning & Repair",
    products: [
      "Aircon Cleaning",
      "Freon Charging",
      "Installation",
      "Repair of AC units",
      "Others (Custom)"
    ]
  },

  // PROFESSIONAL & BUSINESS SERVICES
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Consultancy Services (Specify field: e.g., Management, IT, Financial, HR, Marketing)",
    products: [
      "Management Consulting",
      "IT Consulting",
      "Financial Consulting",
      "HR Consulting",
      "Marketing Consulting",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Accounting / Bookkeeping Services",
    products: [
      "Bookkeeping",
      "Tax Preparation",
      "Financial Statement Preparation",
      "Audit Services",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Legal Services / Law Office",
    products: [
      "Legal Consultation",
      "Document Preparation",
      "Representation in Court",
      "Notarial Services",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Architectural / Engineering Design Services",
    products: [
      "Building Design",
      "Structural Design",
      "Electrical Design",
      "Project Supervision",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Marketing / Advertising Agency",
    products: [
      "Branding",
      "Digital Marketing",
      "Social Media Management",
      "Content Creation",
      "Ad Campaign Management",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Web Design / Software Development",
    products: [
      "Website Design",
      "Web Development",
      "Mobile App Development",
      "Custom Software Solutions",
      "SEO Services",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Business Process Outsourcing (BPO) / Call Center",
    products: [
      "Customer Service",
      "Technical Support",
      "Data Entry",
      "Telemarketing",
      "Virtual Assistance",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Real Estate Brokerage / Agency",
    products: [
      "Property Sales",
      "Property Leasing",
      "Property Appraisal",
      "Real Estate Consultation",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Printing Press / Printing Services",
    products: [
      "Business Cards",
      "Flyers",
      "Brochures",
      "Tarpaulins",
      "Document Printing",
      "T-shirt Printing",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Travel Agency / Tour Operator",
    products: [
      "Airline Ticketing",
      "Hotel Booking",
      "Tour Packages",
      "Visa Assistance",
      "Others (Custom)"
    ]
  },
  {
    category: "PROFESSIONAL & BUSINESS SERVICES",
    name: "Manpower Agency / Recruitment Services",
    products: [
      "Sourcing Candidates",
      "Job Placement",
      "Staffing Solutions",
      "Others (Custom)"
    ]
  },

  // MANUFACTURING
  {
    category: "MANUFACTURING",
    name: "Garments Manufacturing",
    products: [
      "T-shirts",
      "Uniforms",
      "Dresses",
      "Pants",
      "Others (Custom)"
    ]
  },
  {
    category: "MANUFACTURING",
    name: "Food Manufacturing / Processing",
    products: [
      "Processed Meats (tocino, longganisa)",
      "Bottled Goods (preserves, sauces)",
      "Baked Goods (for wholesale)",
      "Snacks",
      "Others (Custom)"
    ]
  },
  {
    category: "MANUFACTURING",
    name: "Furniture Manufacturing",
    products: [
      "Wooden Furniture",
      "Metal Furniture",
      "Rattan Furniture",
      "Upholstered Furniture",
      "Others (Custom)"
    ]
  },
  {
    category: "MANUFACTURING",
    name: "Metal Fabrication",
    products: [
      "Steel Trusses",
      "Window Grills",
      "Gates",
      "Custom Metal Parts",
      "Others (Custom)"
    ]
  },
  {
    category: "MANUFACTURING",
    name: "Handicraft Manufacturing",
    products: [
      "Woven Baskets",
      "Wood Carvings",
      "Shell Crafts",
      "Native Bags",
      "Others (Custom)"
    ]
  },

  // RENTALS / LEASING
  {
    category: "RENTALS / LEASING",
    name: "Real Estate Lessor (Apartments, Commercial Space)",
    products: [
      "Leasing of Residential Units",
      "Leasing of Commercial Stalls/Offices",
      "Room Rentals",
      "Others (Custom)"
    ]
  },
  {
    category: "RENTALS / LEASING",
    name: "Equipment Rental (Specify type: e.g., Construction, Sound System, Event)",
    products: [
      "Construction Equipment Rental",
      "Sound System Rental",
      "Event Equipment Rental (tables, chairs)",
      "Others (Custom)"
    ]
  },
  {
    category: "RENTALS / LEASING",
    name: "Car / Vehicle Rental",
    products: [
      "Self-drive Car Rental",
      "Car Rental with Driver",
      "Van Rental",
      "Others (Custom)"
    ]
  },

  // OTHERS
  {
    category: "OTHERS",
    name: "Internet Cafe / Pisonet",
    products: [
      "Computer Rental (internet access, gaming)",
      "Printing",
      "Scanning",
      "Others (Custom)"
    ]
  },
  {
    category: "OTHERS",
    name: "Water Refilling Station",
    products: [
      "Purified Water",
      "Mineral Water",
      "Alkaline Water (in gallons/containers)",
      "Others (Custom)"
    ]
  },
  {
    category: "OTHERS",
    name: "Junk Shop / Scrap Dealer",
    products: [
      "Buying and Selling of Recyclable Materials (paper, plastic, metal, glass)",
      "Others (Custom)"
    ]
  },
  {
    category: "OTHERS",
    name: "Event Planning / Coordination",
    products: [
      "Wedding Planning",
      "Party Planning",
      "Corporate Event Management",
      "Supplier Coordination",
      "Others (Custom)"
    ]
  },
  {
    category: "OTHERS",
    name: "Fitness Center / Gym",
    products: [
      "Gym Membership",
      "Personal Training",
      "Group Fitness Classes (Zumba, Yoga)",
      "Others (Custom)"
    ]
  }
];

// Create a mapping for easier lookup
export const businessLineProductsMap = businessLinesData.reduce((acc, item) => {
  acc[item.name] = item.products;
  return acc;
}, {} as Record<string, string[]>);

// Get just the business line options for the dropdown
export const businessLineOptions = businessLinesData.map(item => ({
  category: item.category,
  name: item.name
}));
