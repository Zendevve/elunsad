
export interface BusinessCategory {
  id: string;
  name: string;
  products: string[];
}

export interface BusinessSection {
  id: string;
  title: string;
  categories: BusinessCategory[];
}

export const businessSections: BusinessSection[] = [
  {
    id: "retail",
    title: "I. RETAIL",
    categories: [
      {
        id: "general-merchandise",
        name: "General Merchandise / Sari-Sari Store",
        products: [
          "Groceries (canned goods, noodles, rice)",
          "Snacks & Beverages",
          "Toiletries",
          "School Supplies",
          "Prepaid Load",
          "Household Cleaning Supplies"
        ]
      },
      {
        id: "convenience-store",
        name: "Convenience Store",
        products: [
          "Ready-to-eat meals",
          "Snacks",
          "Beverages (hot & cold)",
          "Basic Groceries",
          "Personal Care Items",
          "Magazines",
          "Over-the-counter medicine"
        ]
      },
      {
        id: "clothing-apparel",
        name: "Clothing & Apparel Store / Boutique",
        products: [
          "Men's Wear",
          "Women's Wear",
          "Children's Wear",
          "Fashion Accessories",
          "Shoes",
          "Bags"
        ]
      },
      {
        id: "electronics-gadgets",
        name: "Electronics & Gadget Store",
        products: [
          "Mobile Phones",
          "Laptops",
          "Tablets",
          "Computer Accessories",
          "Audio Equipment",
          "Smart Home Devices"
        ]
      },
      {
        id: "hardware-store",
        name: "Hardware Store",
        products: [
          "Building Materials (cement, sand, gravel)",
          "Plumbing Supplies",
          "Electrical Supplies",
          "Paints",
          "Tools",
          "Lumber"
        ]
      },
      {
        id: "pharmacy-drugstore",
        name: "Pharmacy / Drugstore",
        products: [
          "Prescription Medicines",
          "Over-the-counter Drugs",
          "Vitamins & Supplements",
          "Medical Supplies",
          "Personal Hygiene Products"
        ]
      },
      {
        id: "bookstore-office",
        name: "Bookstore & Office Supplies",
        products: [
          "Books (fiction, non-fiction, textbooks)",
          "School Supplies",
          "Office Stationery",
          "Art Supplies",
          "Magazines & Newspapers"
        ]
      },
      {
        id: "pet-shop",
        name: "Pet Shop",
        products: [
          "Pet Food",
          "Pet Accessories (collars, leashes, toys)",
          "Pet Cages/Beds",
          "Pet Grooming Supplies"
        ]
      },
      {
        id: "bakery-retail",
        name: "Bakery / Bakeshop (Retail Only)",
        products: [
          "Bread (pandesal, loaf)",
          "Cakes",
          "Pastries",
          "Cookies",
          "Pies"
        ]
      },
      {
        id: "rice-retailing",
        name: "Rice Retailing",
        products: [
          "Sinandomeng Rice",
          "Dinorado Rice",
          "Brown Rice",
          "Other Rice Varieties"
        ]
      },
      {
        id: "meat-shop",
        name: "Meat Shop / Poultry & Meat Dealer",
        products: [
          "Pork",
          "Beef",
          "Chicken",
          "Processed Meats (sausages, tocino)"
        ]
      },
      {
        id: "fishmonger",
        name: "Fishmonger / Seafood Dealer",
        products: [
          "Fresh Fish",
          "Shrimp",
          "Crabs",
          "Shellfish",
          "Other Seafood"
        ]
      },
      {
        id: "fruit-vegetable",
        name: "Fruit & Vegetable Stall",
        products: [
          "Local Fruits",
          "Imported Fruits",
          "Leafy Vegetables",
          "Root Crops",
          "Herbs & Spices"
        ]
      },
      {
        id: "online-retailer",
        name: "Online Retailer / E-commerce",
        products: [
          "Fashion Items",
          "Electronics",
          "Home Goods",
          "Beauty Products",
          "Other Online Products"
        ]
      }
    ]
  },
  {
    id: "food-beverage",
    title: "II. FOOD & BEVERAGE SERVICE",
    categories: [
      {
        id: "restaurant-fine-dining",
        name: "Restaurant / Fine Dining",
        products: [
          "Filipino Cuisine",
          "Italian Cuisine",
          "Japanese Cuisine",
          "Ala Carte Menu",
          "Set Menus",
          "Dine-in Service",
          "Alcoholic Beverages"
        ]
      },
      {
        id: "fast-food",
        name: "Fast Food / Quick Service Restaurant",
        products: [
          "Burgers",
          "Fried Chicken",
          "Fries",
          "Soft Drinks",
          "Packaged Meals",
          "Dine-in",
          "Take-out"
        ]
      },
      {
        id: "cafe-coffee-shop",
        name: "Cafe / Coffee Shop",
        products: [
          "Coffee (brewed, espresso-based)",
          "Tea",
          "Pastries",
          "Sandwiches",
          "Light Meals",
          "Non-coffee Beverages"
        ]
      },
      {
        id: "carinderia-eatery",
        name: "Carinderia / Eatery",
        products: [
          "Pre-cooked Filipino dishes (turo-turo)",
          "Rice meals",
          "Soft drinks",
          "Dine-in Service"
        ]
      },
      {
        id: "food-kiosk",
        name: "Food Kiosk / Food Stall / Food Cart",
        products: [
          "Shawarma",
          "Fries",
          "Siomai",
          "Fruit Shakes",
          "Street Food"
        ]
      },
      {
        id: "bar-pub",
        name: "Bar / Pub",
        products: [
          "Beer",
          "Wine",
          "Spirits",
          "Cocktails",
          "Non-alcoholic Beverages",
          "Bar Chow/Appetizers"
        ]
      },
      {
        id: "catering-services",
        name: "Catering Services",
        products: [
          "Wedding Catering",
          "Party Catering",
          "Corporate Catering",
          "Buffet Setup",
          "Plated Meals"
        ]
      },
      {
        id: "milk-tea-shop",
        name: "Milk Tea Shop / Beverage Stand",
        products: [
          "Milk Tea (various flavors)",
          "Fruit Tea",
          "Smoothies",
          "Juices",
          "Coffee-based Frappes"
        ]
      }
    ]
  },
  {
    id: "personal-services",
    title: "III. PERSONAL SERVICES",
    categories: [
      {
        id: "salon-barber",
        name: "Salon / Barber Shop",
        products: [
          "Haircut",
          "Hair Styling",
          "Hair Color",
          "Hair Treatment",
          "Manicure",
          "Pedicure",
          "Shave"
        ]
      },
      {
        id: "spa-wellness",
        name: "Spa / Wellness Center",
        products: [
          "Massage Therapy",
          "Body Scrubs",
          "Facials",
          "Sauna",
          "Aromatherapy"
        ]
      },
      {
        id: "laundry-shop",
        name: "Laundry Shop / Laundromat",
        products: [
          "Washing",
          "Drying",
          "Folding",
          "Pressing/Ironing",
          "Dry Cleaning"
        ]
      },
      {
        id: "pet-grooming",
        name: "Pet Grooming Services",
        products: [
          "Pet Bathing",
          "Hair Trimming",
          "Nail Clipping",
          "Ear Cleaning"
        ]
      },
      {
        id: "tutorial-center",
        name: "Tutorial Center",
        products: [
          "Academic Tutoring (Math, Science, English)",
          "Test Review (College Entrance, Licensure)",
          "Language Classes"
        ]
      },
      {
        id: "photography-videography",
        name: "Photography / Videography Services",
        products: [
          "Event Coverage (weddings, birthdays)",
          "Portrait Photography",
          "Product Photography",
          "Video Production",
          "Photo/Video Editing"
        ]
      }
    ]
  },
  {
    id: "repair-maintenance",
    title: "IV. REPAIR & MAINTENANCE SERVICES",
    categories: [
      {
        id: "automotive-repair",
        name: "Automotive Repair Shop",
        products: [
          "Engine Repair",
          "Oil Change",
          "Brake Service",
          "Tire Services",
          "Electrical Repair",
          "Body Repair & Painting"
        ]
      },
      {
        id: "motorcycle-repair",
        name: "Motorcycle Repair Shop",
        products: [
          "Engine Overhaul",
          "Tune-up",
          "Parts Replacement",
          "Tire Vulcanizing"
        ]
      },
      {
        id: "electronics-repair",
        name: "Electronics Repair Shop",
        products: [
          "Computer Repair",
          "Laptop Repair",
          "Mobile Phone Repair",
          "TV Repair",
          "Appliance Repair"
        ]
      },
      {
        id: "watch-jewelry-repair",
        name: "Watch Repair / Jewelry Repair",
        products: [
          "Battery Replacement",
          "Strap Replacement",
          "Movement Repair",
          "Jewelry Cleaning",
          "Stone Setting"
        ]
      },
      {
        id: "plumbing-services",
        name: "Plumbing Services",
        products: [
          "Leak Repair",
          "Drain Cleaning",
          "Fixture Installation",
          "Pipe Installation"
        ]
      },
      {
        id: "electrical-services",
        name: "Electrical Services",
        products: [
          "Wiring Installation",
          "Outlet Repair",
          "Lighting Fixture Installation",
          "Electrical Troubleshooting"
        ]
      },
      {
        id: "aircon-repair",
        name: "Aircon Cleaning & Repair",
        products: [
          "Aircon Cleaning",
          "Freon Charging",
          "Installation",
          "AC Unit Repair"
        ]
      }
    ]
  },
  {
    id: "professional-business",
    title: "V. PROFESSIONAL & BUSINESS SERVICES",
    categories: [
      {
        id: "consultancy-services",
        name: "Consultancy Services",
        products: [
          "Management Consulting",
          "IT Consulting",
          "Financial Consulting",
          "HR Consulting",
          "Marketing Consulting"
        ]
      },
      {
        id: "accounting-bookkeeping",
        name: "Accounting / Bookkeeping Services",
        products: [
          "Bookkeeping",
          "Tax Preparation",
          "Financial Statement Preparation",
          "Audit Services"
        ]
      },
      {
        id: "legal-services",
        name: "Legal Services / Law Office",
        products: [
          "Legal Consultation",
          "Document Preparation",
          "Court Representation",
          "Notarial Services"
        ]
      },
      {
        id: "architectural-engineering",
        name: "Architectural / Engineering Design Services",
        products: [
          "Building Design",
          "Structural Design",
          "Electrical Design",
          "Project Supervision"
        ]
      },
      {
        id: "marketing-advertising",
        name: "Marketing / Advertising Agency",
        products: [
          "Branding",
          "Digital Marketing",
          "Social Media Management",
          "Content Creation",
          "Ad Campaign Management"
        ]
      },
      {
        id: "web-design-software",
        name: "Web Design / Software Development",
        products: [
          "Website Design",
          "Web Development",
          "Mobile App Development",
          "Custom Software Solutions",
          "SEO Services"
        ]
      },
      {
        id: "bpo-call-center",
        name: "Business Process Outsourcing (BPO) / Call Center",
        products: [
          "Customer Service",
          "Technical Support",
          "Data Entry",
          "Telemarketing",
          "Virtual Assistance"
        ]
      },
      {
        id: "real-estate-brokerage",
        name: "Real Estate Brokerage / Agency",
        products: [
          "Property Sales",
          "Property Leasing",
          "Property Appraisal",
          "Real Estate Consultation"
        ]
      },
      {
        id: "printing-services",
        name: "Printing Press / Printing Services",
        products: [
          "Business Cards",
          "Flyers",
          "Brochures",
          "Tarpaulins",
          "Document Printing",
          "T-shirt Printing"
        ]
      },
      {
        id: "travel-agency",
        name: "Travel Agency / Tour Operator",
        products: [
          "Airline Ticketing",
          "Hotel Booking",
          "Tour Packages",
          "Visa Assistance"
        ]
      },
      {
        id: "manpower-agency",
        name: "Manpower Agency / Recruitment Services",
        products: [
          "Sourcing Candidates",
          "Job Placement",
          "Staffing Solutions"
        ]
      }
    ]
  },
  {
    id: "manufacturing",
    title: "VI. MANUFACTURING",
    categories: [
      {
        id: "garments-manufacturing",
        name: "Garments Manufacturing",
        products: [
          "T-shirts",
          "Uniforms",
          "Dresses",
          "Pants",
          "Other Clothing"
        ]
      },
      {
        id: "food-manufacturing",
        name: "Food Manufacturing / Processing",
        products: [
          "Processed Meats (tocino, longganisa)",
          "Bottled Goods (preserves, sauces)",
          "Baked Goods (for wholesale)",
          "Snacks"
        ]
      },
      {
        id: "furniture-manufacturing",
        name: "Furniture Manufacturing",
        products: [
          "Wooden Furniture",
          "Metal Furniture",
          "Rattan Furniture",
          "Upholstered Furniture"
        ]
      },
      {
        id: "metal-fabrication",
        name: "Metal Fabrication",
        products: [
          "Steel Trusses",
          "Window Grills",
          "Gates",
          "Custom Metal Parts"
        ]
      },
      {
        id: "handicraft-manufacturing",
        name: "Handicraft Manufacturing",
        products: [
          "Woven Baskets",
          "Wood Carvings",
          "Shell Crafts",
          "Native Bags"
        ]
      }
    ]
  },
  {
    id: "rentals-leasing",
    title: "VII. RENTALS / LEASING",
    categories: [
      {
        id: "real-estate-lessor",
        name: "Real Estate Lessor",
        products: [
          "Leasing of Residential Units",
          "Leasing of Commercial Stalls/Offices",
          "Room Rentals"
        ]
      },
      {
        id: "equipment-rental",
        name: "Equipment Rental",
        products: [
          "Construction Equipment Rental",
          "Sound System Rental",
          "Event Equipment Rental (tables, chairs)"
        ]
      },
      {
        id: "vehicle-rental",
        name: "Car / Vehicle Rental",
        products: [
          "Self-drive Car Rental",
          "Car Rental with Driver",
          "Van Rental"
        ]
      }
    ]
  },
  {
    id: "others",
    title: "VIII. OTHERS",
    categories: [
      {
        id: "internet-cafe",
        name: "Internet Cafe / Pisonet",
        products: [
          "Computer Rental (internet access, gaming)",
          "Printing",
          "Scanning"
        ]
      },
      {
        id: "water-refilling",
        name: "Water Refilling Station",
        products: [
          "Purified Water",
          "Mineral Water",
          "Alkaline Water"
        ]
      },
      {
        id: "junk-shop",
        name: "Junk Shop / Scrap Dealer",
        products: [
          "Recyclable Materials (paper, plastic, metal, glass)"
        ]
      },
      {
        id: "event-planning",
        name: "Event Planning / Coordination",
        products: [
          "Wedding Planning",
          "Party Planning",
          "Corporate Event Management",
          "Supplier Coordination"
        ]
      },
      {
        id: "fitness-center",
        name: "Fitness Center / Gym",
        products: [
          "Gym Membership",
          "Personal Training",
          "Group Fitness Classes (Zumba, Yoga)"
        ]
      }
    ]
  }
];

// Utility functions
export const getAllBusinessTypes = (): { value: string; label: string; section: string }[] => {
  const allTypes: { value: string; label: string; section: string }[] = [];
  
  businessSections.forEach(section => {
    section.categories.forEach(category => {
      allTypes.push({
        value: category.id,
        label: category.name,
        section: section.title
      });
    });
  });
  
  // Add "Other" option
  allTypes.push({
    value: "other",
    label: "Other - Please Specify",
    section: "Custom"
  });
  
  return allTypes;
};

export const getProductsForBusinessType = (businessTypeId: string): string[] => {
  for (const section of businessSections) {
    for (const category of section.categories) {
      if (category.id === businessTypeId) {
        return [...category.products, "Other - Please Specify"];
      }
    }
  }
  return ["Other - Please Specify"];
};

export const getBusinessTypeById = (id: string): BusinessCategory | null => {
  for (const section of businessSections) {
    for (const category of section.categories) {
      if (category.id === id) {
        return category;
      }
    }
  }
  return null;
};
