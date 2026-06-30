import { DatabaseState } from '../types';

export const initialDatabaseState: DatabaseState = {
  users: [
    {
      id: 'usr-1',
      name: 'Vipu Rishikesh',
      email: 'vipu@onehope.in',
      phone: '+91 8630027341',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      joinedDate: '2026-01-01',
      savedStories: [],
      savedCampaigns: [],
      achievements: [
        { id: 'ach-1', title: 'Founding Member', icon: '🌟', date: '2026-01-01' },
        { id: 'ach-2', title: 'Super Admin Access', icon: '🔑', date: '2026-01-01' }
      ],
      certificates: [],
      volunteerStatus: 'Approved',
      volunteerHours: 120,
      volunteerPoints: 1200
    },
    {
      id: 'usr-2',
      name: 'Aanya Sharma',
      email: 'aanya@gmail.com',
      role: 'Volunteer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      joinedDate: '2026-03-15',
      savedStories: ['story-1'],
      savedCampaigns: ['camp-1'],
      achievements: [
        { id: 'ach-3', title: 'First Check-in', icon: '⏱️', date: '2026-03-20' },
        { id: 'ach-4', title: '50 Hours Served', icon: '🏆', date: '2026-05-10' }
      ],
      certificates: [
        { id: 'cert-1', title: 'Certified Field Responder', category: 'Disaster Relief', issueDate: '2026-05-12', pdfUrl: '#' }
      ],
      volunteerStatus: 'Approved',
      volunteerHours: 54,
      volunteerPoints: 540
    },
    {
      id: 'usr-3',
      name: 'Rahul Verma',
      email: 'rahul@gmail.com',
      role: 'User',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      joinedDate: '2026-05-01',
      savedStories: [],
      savedCampaigns: [],
      achievements: [],
      certificates: [],
      volunteerStatus: 'None',
      volunteerHours: 0,
      volunteerPoints: 0
    }
  ],
  currentUser: {
    id: 'usr-1',
    name: 'Vipu Rishikesh',
    email: 'vipu@onehope.in',
    phone: '+91 8630027341',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    joinedDate: '2026-01-01',
    savedStories: [],
    savedCampaigns: [],
    achievements: [
      { id: 'ach-1', title: 'Founding Member', icon: '🌟', date: '2026-01-01' },
      { id: 'ach-2', title: 'Super Admin Access', icon: '🔑', date: '2026-01-01' }
    ],
    certificates: [],
    volunteerStatus: 'Approved',
    volunteerHours: 120,
    volunteerPoints: 1200
  },
  campaigns: [
    {
      id: 'camp-1',
      title: 'Feed 50 Hungry Children Today',
      category: 'Food',
      goalAmount: 300000,
      raisedAmount: 185000,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
      summary: 'Many children in Rishikesh sleep hungry every day. Your contribution helps provide freshly prepared nutritious meals and clean drinking water.',
      description: 'Many children in Rishikesh sleep hungry every day. Your contribution helps provide freshly prepared nutritious meals and clean drinking water.',
      location: 'Rishikesh, Uttarakhand',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9230559388334!2d78.2937989!3d30.1250262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909162464b58e77%3A0xe5eb6c429074d2a1!2sTriveni%20Ghat%20Rishikesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      gallery: [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=400'
      ],
      videos: [],
      updates: [],
      timeline: [
        { id: 't-1', title: 'Route Sourcing', description: 'Map out targeted slum nodes and schools near Triveni Ghat.', date: '2026-06-01', completed: true },
        { id: 't-2', title: 'Daily Sponsoring Live', description: 'Start meals distribution.', date: '2026-06-15', completed: true }
      ],
      comments: [],
      recentDonations: [
        { id: 'd-1', donorName: 'Aakash Mehta', amount: 500, date: '2026-06-25', isAnonymous: false }
      ],
      volunteersCount: 12,
      createdAt: '2026-06-01',
      status: 'Active',
      pricePerUnit: 100,
      unitLabel: 'child',
      provides: [
        'Fresh cooked meal',
        'Rice or Roti',
        'Dal',
        'Seasonal Vegetable',
        'Fresh Fruit (when available)',
        'Safe Drinking Water Bottle',
        'Hygienic serving'
      ]
    },
    {
      id: 'camp-2',
      title: 'Help Priya Continue Her Education',
      category: 'Education',
      goalAmount: 500000,
      raisedAmount: 245000,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200',
      summary: 'Many children cannot attend school because they lack basic educational supplies.',
      description: 'Many children cannot attend school because they lack basic educational supplies. Help sponsor essentials to keep them enrolled.',
      location: 'Rishikesh, Uttarakhand',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9230559388334!2d78.2937989!3d30.1250262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909162464b58e77%3A0xe5eb6c429074d2a1!2sTriveni%20Ghat%20Rishikesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      gallery: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400'
      ],
      videos: [],
      updates: [],
      timeline: [
        { id: 't-3', title: 'Logistics Setup', description: 'Procure bags, notebooks and geometry kits from suppliers.', date: '2026-06-05', completed: true },
        { id: 't-4', title: 'Field Distribution', description: 'Deliver study materials directly to students.', date: '2026-06-20', completed: true }
      ],
      comments: [],
      recentDonations: [
        { id: 'd-2', donorName: 'Dr. Gauri Sharma', amount: 1500, date: '2026-06-27', isAnonymous: false }
      ],
      volunteersCount: 6,
      createdAt: '2026-06-05',
      status: 'Active',
      pricePerUnit: 500,
      unitLabel: 'child',
      provides: [
        'School Bag',
        'Notebooks',
        'Pens & Pencils',
        'Eraser',
        'Sharpener',
        'Geometry Box',
        'Water Bottle',
        'Educational Essentials'
      ]
    },
    {
      id: 'camp-3',
      title: 'Support Mayakund Families with Ration Kits',
      category: 'Food',
      goalAmount: 800000,
      raisedAmount: 410000,
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200',
      summary: 'Help struggling families receive essential groceries for daily survival.',
      description: 'Help struggling families receive essential groceries for daily survival. Designed to support one family with essential groceries.',
      location: 'Rishikesh, Uttarakhand',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9230559388334!2d78.2937989!3d30.1250262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909162464b58e77%3A0xe5eb6c429074d2a1!2sTriveni%20Ghat%20Rishikesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      gallery: [
        'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400'
      ],
      videos: [],
      updates: [],
      timeline: [
        { id: 't-5', title: 'Wholesale Sourcing', description: 'Procure bulk grains, sugar, spices, and hygiene soaps.', date: '2026-06-08', completed: true }
      ],
      comments: [],
      recentDonations: [],
      volunteersCount: 9,
      createdAt: '2026-06-08',
      status: 'Active',
      pricePerUnit: 2500,
      unitLabel: 'family',
      provides: [
        'Rice',
        'Wheat Flour (Atta)',
        'Dal',
        'Cooking Oil',
        'Salt',
        'Sugar',
        'Tea',
        'Basic Spices',
        'Biscuits for Children',
        'Soap & Hygiene Essentials'
      ]
    },
    {
      id: 'camp-4',
      title: 'Gift New Clothes to 30 Slum Kids',
      category: 'Children',
      goalAmount: 400000,
      raisedAmount: 128000,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200',
      summary: 'Many children wear damaged or worn-out clothes. Help restore dignity and confidence.',
      description: 'Many children wear damaged or worn-out clothes. Help restore dignity and confidence. Sponsoring new garments helps children grow with pride.',
      location: 'Rishikesh, Uttarakhand',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9230559388334!2d78.2937989!3d30.1250262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909162464b58e77%3A0xe5eb6c429074d2a1!2sTriveni%20Ghat%20Rishikesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      gallery: [],
      videos: [],
      updates: [],
      timeline: [],
      comments: [],
      recentDonations: [],
      volunteersCount: 4,
      createdAt: '2026-06-10',
      status: 'Active',
      pricePerUnit: 500,
      unitLabel: 'child',
      provides: [
        'New T-Shirt',
        'Pants',
        'Warm Clothing (Seasonal)',
        'Socks',
        'Basic Footwear (when available)',
        'Safe Packaging'
      ]
    },
    {
      id: 'camp-5',
      title: 'Feed and Care for 60 Stray Animals',
      category: 'Animals',
      goalAmount: 300000,
      raisedAmount: 92000,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200',
      summary: 'Support food and basic care for stray animals living around Rishikesh.',
      description: 'Support food and basic care for stray animals living around Rishikesh. Animals include: Dogs, Cats, Cows, Birds.',
      location: 'Rishikesh, Uttarakhand',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9230559388334!2d78.2937989!3d30.1250262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909162464b58e77%3A0xe5eb6c429074d2a1!2sTriveni%20Ghat%20Rishikesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      gallery: [],
      videos: [],
      updates: [],
      timeline: [],
      comments: [],
      recentDonations: [],
      volunteersCount: 5,
      createdAt: '2026-06-12',
      status: 'Active',
      pricePerUnit: 100,
      unitLabel: 'animal',
      provides: [
        'Nutritious Animal Food',
        'Clean Drinking Water',
        'Basic Medical Assistance (when required)',
        'Emergency Feeding'
      ]
    },
    {
      id: 'camp-6',
      title: 'Celebrate Festivals with Rishikesh Kids',
      category: 'Children',
      goalAmount: 600000,
      raisedAmount: 310000,
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200',
      summary: 'Share your happiness with children who rarely experience birthdays or special events.',
      description: 'Instead of organizing a private celebration, share your happiness with children who rarely experience birthdays or special events.',
      location: 'Rishikesh, Uttarakhand',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9230559388334!2d78.2937989!3d30.1250262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909162464b58e77%3A0xe5eb6c429074d2a1!2sTriveni%20Ghat%20Rishikesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      gallery: [],
      videos: [],
      updates: [],
      timeline: [],
      comments: [],
      recentDonations: [],
      volunteersCount: 8,
      createdAt: '2026-06-14',
      status: 'Active',
      provides: [
        'Cake',
        'Fresh Meals',
        'Juice',
        'Balloons',
        'Decorations',
        'Small Return Gifts',
        'Group Photos',
        'Thank You Message'
      ],
      donationLevels: [
        { amount: 2000, label: 'Cake + Snacks' },
        { amount: 5000, label: 'Cake + Meal + Celebration' },
        { amount: 10000, label: 'Complete Celebration Event' }
      ]
    },
    {
      id: 'camp-7',
      title: 'Emergency Medical Assistance',
      category: 'Emergency',
      goalAmount: 1000000,
      raisedAmount: 560000,
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
      summary: 'Support urgent healthcare for children, elderly people, and families in need.',
      description: 'Medical emergencies can happen to anyone. Support urgent healthcare for children, elderly people, and families in need.',
      location: 'Rishikesh, Uttarakhand',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9230559388334!2d78.2937989!3d30.1250262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909162464b58e77%3A0xe5eb6c429074d2a1!2sTriveni%20Ghat%20Rishikesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      gallery: [],
      videos: [],
      updates: [],
      timeline: [],
      comments: [],
      recentDonations: [],
      volunteersCount: 14,
      createdAt: '2026-06-16',
      status: 'Active',
      provides: [
        'Medicines',
        'Emergency Treatment',
        'Hospital Support',
        'Diagnostic Tests',
        'Ambulance Assistance (when required)',
        'Life-saving Care'
      ],
      donationLevels: [
        { amount: 500, label: 'Medicines' },
        { amount: 1000, label: 'Doctor Consultation' },
        { amount: 2500, label: 'Emergency Treatment Support' },
        { amount: 5000, label: 'Critical Care Assistance' }
      ]
    }
  ],
  stories: [
    {
      id: 'story-1',
      title: 'Meet Preeti: Dreaming of Science',
      author: 'OneHope Stories Team',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      media: [
        {
          url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
          type: 'image'
        }
      ],
      description: 'Preeti lives in an remote village near Rishikesh. Thanks to the Himalayan Education campaign, she received a scientific toolkit, books, and her first school bag. Now she wants to study physics and build solar cells for her village!',
      category: 'Education',
      likes: 245,
      likedBy: [],
      bookmarks: [],
      comments: [
        { id: 'sc-1', userName: 'Rohan Sharma', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', text: 'This gives me tears of joy. Beautiful work!', date: '2026-06-25' }
      ],
      location: 'Rishikesh, India',
      date: '2026-06-24',
      campaignId: 'camp-1'
    },
    {
      id: 'story-2',
      title: 'Nutrition Shield Delivery Walkthrough',
      author: 'Gauri Volunteer',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      media: [
        {
          url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600',
          type: 'image'
        }
      ],
      description: 'Spend a morning with Gauri, one of our lead food-distribution coordinators, delivering warm meals and fresh apples to children at the urban railway slums. We serve smiles daily!',
      category: 'Food',
      likes: 189,
      likedBy: [],
      bookmarks: [],
      comments: [],
      location: 'Dehradun, India',
      date: '2026-06-27',
      campaignId: 'camp-2'
    },
    {
      id: 'story-3',
      title: 'Sita Devi Recovers After Heart Surgery',
      author: 'Dr. Vivek, Partner Hospital',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      media: [
        {
          url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
          type: 'image'
        }
      ],
      description: 'Sita Devi, a vegetable seller, suffered from severe coronary disease. Through the Emergency Medical Aid Fund, she received cashless coronary surgery at Max Hospital Dehradun and is now happily recovering at home with her grandchildren.',
      category: 'Medical',
      likes: 412,
      likedBy: [],
      bookmarks: [],
      comments: [],
      location: 'Uttarakhand, India',
      date: '2026-06-20',
      campaignId: 'camp-3'
    }
  ],
  blogs: [
    {
      id: 'blog-1',
      title: 'Transparency in Charity: Why Every Rupee Counts',
      slug: 'transparency-in-charity',
      excerpt: 'At OneHope, transparency is not a marketing term; it is our foundation. Let us look at how public audit ledgers and field reports are revolutionizing donation confidence.',
      content: '<p>Trust is the ultimate currency of any non-profit organization. For years, donors have given to causes without knowing exactly how their contributions are allocated. In this blog, we explore the tech-driven transparent approach OneHope uses: public ledger access, GPS-tagged delivery photos, and granular monthly cost summaries...</p><p>We believe that when a donor gives ₹100, they have a right to trace exactly where it goes. This is why we publish itemized lists of foods purchased, uniforms distributed, and surgery invoices directly to our Transparency Dashboard.</p>',
      coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
      author: {
        name: 'Vipu Rishikesh',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        bio: 'Founder of OneHope. Passionate about using technology to bring integrity and dignity to human welfare systems.'
      },
      category: 'Transparency',
      tags: ['Welfare', 'Transparency', 'Best Practices'],
      readTime: '4 min read',
      date: '2026-06-15',
      published: true
    },
    {
      id: 'blog-2',
      title: 'The Child Malnutrition Crisis in Urban Slums',
      slug: 'child-malnutrition-urban-slums',
      excerpt: 'Staggering metrics and community solutions to build a nutritional shield around kids residing in railway-siding slums.',
      content: '<p>Malnutrition is a silent crisis that robs children of their future potential. While severe acute malnutrition is easily visible, micronutrient deficiencies—often called "hidden hunger"—go unnoticed while damaging cognitive development, immune defenses, and productivity...</p><p>Our field research shows that simple supplements of protein and vitamins coupled with worming treatments can trigger dramatic improvements in school attendance and activity scores.</p>',
      coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
      author: {
        name: 'Aanya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        bio: 'Lead Volunteer and Nutritionist. Spends her weekends organizing community distribution camps.'
      },
      category: 'Nutrition',
      tags: ['Health', 'Slum Welfare', 'Child Development'],
      readTime: '6 min read',
      date: '2026-06-20',
      published: true
    }
  ],
  donations: [
    {
      id: 'don-1',
      donorName: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      phone: '+91 9988776655',
      amount: 15000,
      isAnonymous: false,
      campaignId: 'camp-1',
      paymentMethod: 'UPI',
      date: '2026-06-12 11:30',
      isMonthly: false,
      status: 'Success',
      receiptNumber: 'OH-REC-100241'
    },
    {
      id: 'don-2',
      donorName: 'Anonymous',
      email: 'secret@gmail.com',
      amount: 50000,
      isAnonymous: true,
      campaignId: 'camp-1',
      paymentMethod: 'Card',
      date: '2026-06-20 14:15',
      isMonthly: false,
      status: 'Success',
      receiptNumber: 'OH-REC-100242'
    },
    {
      id: 'don-3',
      donorName: 'Rohan Deshmukh',
      email: 'rohan.desh@outlook.com',
      phone: '+91 9876543210',
      amount: 8000,
      isAnonymous: false,
      campaignId: 'camp-2',
      paymentMethod: 'Netbanking',
      date: '2026-06-25 09:45',
      isMonthly: true,
      status: 'Success',
      receiptNumber: 'OH-REC-100243'
    }
  ],
  volunteerApplications: [
    {
      id: 'vol-app-1',
      userId: 'usr-3',
      name: 'Rahul Verma',
      email: 'rahul@gmail.com',
      phone: '+91 9191919191',
      skills: ['Teaching', 'English Communication'],
      experience: 'Tutored children in my neighborhood for 1 year.',
      identityDocUrl: '#',
      status: 'Pending',
      appliedDate: '2026-06-28'
    }
  ],
  volunteerTasks: [
    {
      id: 'task-1',
      title: 'Distribute textbooks in Himalayan school',
      description: 'Log textbooks package from storage, carry to target school in foothills, distribute, and register names.',
      campaignId: 'camp-1',
      campaignTitle: 'Himalayan Education: Empowering Rishikesh Children',
      status: 'Assigned',
      hoursAssigned: 4,
      date: '2026-06-29'
    },
    {
      id: 'task-2',
      title: 'Food preparation assistant',
      description: 'Help the chef load raw materials, package meal boxes and separate seasonal fruits.',
      campaignId: 'camp-2',
      campaignTitle: 'Nutrition Shield: Meals for Street Children',
      status: 'Completed',
      hoursAssigned: 6,
      date: '2026-06-27'
    }
  ],
  attendance: [
    {
      id: 'att-1',
      userId: 'usr-2',
      date: '2026-06-27',
      checkIn: '08:00',
      checkOut: '14:00',
      hoursWorked: 6
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Meera K.',
      role: 'Sponsor of Sonu, Rishikesh Base',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      quote: 'Direct sponsoring is real. Sonu got his winter school uniform, and I received the delivery photo hash via email within 24 hours of payment.',
      rating: 5
    },
    {
      id: 'test-2',
      name: 'Vikram S.',
      role: 'Sponsor, Dehradun (Ganga Ghat Kitchen)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      quote: 'The level of transparency here is unmatched. I can audit the direct vendor invoice matching my monthly grain sponsorship on the public database ledger.',
      rating: 5
    },
    {
      id: 'test-3',
      name: 'Preeti R.',
      role: 'Sponsor, Delhi (Family Ration Kits)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      quote: 'Knowing that 100% of my donation is going directly to buy wheat and rice from local suppliers without middleman leakage is why I trust OneHope.',
      rating: 5
    }
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Do I get a receipt for my donation?',
      answer: 'Yes! Every contribution instantly generates a digital confirmation receipt showing the breakdown of materials or services sponsored on the ground in Rishikesh.',
      category: 'Donations'
    },
    {
      id: 'faq-2',
      question: 'How do you verify where my money goes?',
      answer: 'We post granular financial entries, audited expenses, monthly reports, and geo-tagged images of our distribution campaigns on our real-time Transparency Page.',
      category: 'Transparency'
    },
    {
      id: 'faq-3',
      question: 'Can I volunteer offline in Rishikesh?',
      answer: 'Absolutely! Rishikesh is our founding base. You can register through the "Become Volunteer" portal, undergo identity verification, and join our active field teams.',
      category: 'Volunteer'
    }
  ],
  supportTickets: [
    {
      id: 'tick-1',
      userId: 'usr-2',
      subject: 'Inquiry regarding transaction confirmation receipt',
      description: 'I donated ₹8000 on June 25th, but my dashboard says receipt generation pending. Kindly assist.',
      status: 'Open',
      date: '2026-06-28',
      replies: []
    }
  ],
  auditLogs: [
    {
      id: 'log-1',
      userId: 'usr-1',
      userName: 'Vipu Rishikesh',
      action: 'Updated Homepage Hero CMS',
      details: 'Changed title and background banner image via visual editor.',
      timestamp: '2026-06-28 18:22'
    }
  ],
  newsletterSubscribers: ['subscriber1@gmail.com'],
  cms: {
    hero: {
      title: 'Hope Starts With One.',
      subtitle: 'Welcome to OneHope, an international-level humanitarian platform dedicated to helping children, families, and communities with absolute transparency, integrity, and compassion.',
      ctaDonateText: 'Donate Now',
      ctaVolunteerText: 'Become Volunteer',
      backgroundImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1800'
    },
    counters: {
      mealsServed: 124500,
      childrenEducated: 4800,
      medicalSupplies: 12500,
      disasterResponded: 14
    },
    transparency: {
      donationAllocation: [
        { category: 'Direct Program Relief', percentage: 85, color: '#2563EB' },
        { category: 'Program Deployment & Field Staff', percentage: 9, color: '#22C55E' },
        { category: 'Administration & Governance', percentage: 4, color: '#F59E0B' },
        { category: 'Fundraising & Technology Infrastructure', percentage: 2, color: '#EF4444' }
      ],
      expenseBreakdown: [
        { month: 'Jan', raised: 450000, spent: 390000 },
        { month: 'Feb', raised: 520000, spent: 480000 },
        { month: 'Mar', raised: 610000, spent: 540000 },
        { month: 'Apr', raised: 850000, spent: 780000 },
        { month: 'May', raised: 920000, spent: 890000 },
        { month: 'Jun', raised: 1100000, spent: 950000 }
      ]
    }
  },
  settings: {
    brandName: 'OneHope',
    tagline: 'Hope Starts With One.',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?auto=format&fit=crop&q=80&w=150',
    supportPhone: '+91 8630027341',
    supportEmail: 'hello@onehope.in',
    thanksEmail: 'thanks@onehope.in',
    socials: {
      instagram: 'https://instagram.com/onehope.in',
      youtube: 'https://youtube.com/@onehopeindia',
      facebook: 'https://www.facebook.com/people/OneHope/61591051727841/',
      whatsapp: 'https://wa.me/918630027341'
    },
    seo: {
      metaTitle: 'OneHope | Hope Starts With One',
      metaDescription: 'OneHope is an international-level humanitarian platform helping street children, families, and disaster zones with honesty, transparency, and dignity from Rishikesh, India.',
      keywords: 'Rishikesh charity, relief India, help children, emergency relief, transparent charity, become volunteer'
    },
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Campaigns', href: '/campaigns' },
      { label: 'Stories (Reels)', href: '/stories' },
      { label: 'Transparency', href: '/transparency' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' }
    ],
    footer: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Mission', href: '/mission' },
      { label: 'Our Impact', href: '/impact' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Videos', href: '/videos' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
      { label: 'Cookie Policy', href: '/cookies' }
    ]
  }
};
