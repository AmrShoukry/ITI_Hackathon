import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Roles
  const rolesData = [
    { name: 'GUEST', description: 'Anonymous visitors' },
    { name: 'RENTER', description: 'Users who rent items' },
    { name: 'OWNER', description: 'Users who list items and manage bookings' },
    { name: 'ADMIN', description: 'Platform Administrators' },
  ];

  const roles: Record<string, any> = {};
  for (const role of rolesData) {
    roles[role.name] = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // 2. Create Permissions
  const permissionsData = [
    { name: 'BROWSE_LISTINGS', description: 'Browse and search items' },
    { name: 'CREATE_BOOKING', description: 'Create bookings for items' },
    { name: 'CREATE_LISTING', description: 'Create listings' },
    { name: 'MANAGE_LISTINGS', description: 'Edit or delete own listings' },
    { name: 'APPROVE_BOOKING', description: 'Approve renter booking requests' },
    { name: 'REJECT_BOOKING', description: 'Reject renter booking requests' },
    { name: 'APPROVE_LISTINGS_ADMIN', description: 'Approve listings as admin' },
    { name: 'VERIFY_OWNERS_ADMIN', description: 'Approve owner verifications' },
    { name: 'MANAGE_CATEGORIES_ADMIN', description: 'Manage item categories' },
    { name: 'SUBMIT_DAMAGE_REPORT', description: 'Submit damage reports' },
    { name: 'CREATE_REVIEW', description: 'Rate and review bookings' },
  ];

  const permissions: Record<string, any> = {};
  for (const perm of permissionsData) {
    permissions[perm.name] = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // 3. Link Roles and Permissions
  const rolePermissionsMap: Record<string, string[]> = {
    GUEST: ['BROWSE_LISTINGS'],
    RENTER: [
      'BROWSE_LISTINGS',
      'CREATE_BOOKING',
      'CREATE_REVIEW',
    ],
    OWNER: [
      'BROWSE_LISTINGS',
      'CREATE_LISTING',
      'MANAGE_LISTINGS',
      'APPROVE_BOOKING',
      'REJECT_BOOKING',
      'SUBMIT_DAMAGE_REPORT',
      'CREATE_REVIEW',
    ],
    ADMIN: Object.keys(permissions),
  };

  for (const [roleName, permNames] of Object.entries(rolePermissionsMap)) {
    const roleId = roles[roleName].id;
    for (const name of permNames) {
      const permissionId = permissions[name].id;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId, permissionId },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
    }
  }

  // 4. Create Categories
  const categoriesData = [
    {
      nameEn: 'Electronics',
      nameAr: 'إلكترونيات',
      descriptionEn: 'Phones, laptops, cameras and accessories',
      descriptionAr: 'الهواتف، أجهزة الكمبيوتر المحمولة، الكاميرات وملحقاتها',
    },
    {
      nameEn: 'Tools & Equipment',
      nameAr: 'أدوات ومعدات',
      descriptionEn: 'Power tools, hand tools, gardening equipment',
      descriptionAr: 'الأدوات الكهربائية، الأدوات اليدوية، معدات الحدائق',
    },
    {
      nameEn: 'Sports & Outdoors',
      nameAr: 'رياضة وفي الهواء الطلق',
      descriptionEn: 'Bicycles, camping gear, fitness equipment',
      descriptionAr: 'الدراجات، معدات التخييم، معدات اللياقة البدنية',
    },
    {
      nameEn: 'Party & Events',
      nameAr: 'الحفلات والفعاليات',
      descriptionEn: 'Sound systems, projectors, party tents, chairs',
      descriptionAr: 'أنظمة الصوت، أجهزة العرض، خيام الحفلات، الكراسي',
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { nameEn: cat.nameEn },
      update: {},
      create: cat,
    });
  }

  const adminSettingsData = [
    {
      settingKey: 'pricing_rule',
      settingValue: 'Owners set the final daily price, subject to admin review.',
      description: 'Platform pricing policy',
    },
    {
      settingKey: 'deposit_policy',
      settingValue: 'Default deposit should cover at least one rental day.',
      description: 'Platform deposit policy',
    },
  ];

  for (const setting of adminSettingsData) {
    await prisma.adminSetting.upsert({
      where: { settingKey: setting.settingKey },
      update: {
        settingValue: setting.settingValue,
        description: setting.description,
      },
      create: setting,
    });
  }

  // 5. Create default Admin User
  const adminEmail = 'admin@itemrental.com';
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'System Admin',
      email: adminEmail,
      phone: '+1234567890',
      passwordHash: hashedPassword,
      roleId: roles['ADMIN'].id,
      status: 'Active',
      preferredLanguage: 'en',
    },
  });

  // Create a default Owner and Renter for easy testing
  const ownerEmail = 'owner@itemrental.com';
  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      name: 'Verified Owner',
      email: ownerEmail,
      phone: '+1234567891',
      passwordHash: hashedPassword,
      roleId: roles['OWNER'].id,
      status: 'Active',
      preferredLanguage: 'en',
      // Auto-approve verification to allow listing creation
      verifications: {
        create: {
          nationalIdUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          status: 'Approved',
          decisionReason: 'Auto-approved for demo/testing',
        },
      },
    },
  });

  const renterEmail = 'renter@itemrental.com';
  await prisma.user.upsert({
    where: { email: renterEmail },
    update: {},
    create: {
      name: 'John Renter',
      email: renterEmail,
      phone: '+1234567892',
      passwordHash: hashedPassword,
      roleId: roles['RENTER'].id,
      status: 'Active',
      preferredLanguage: 'en',
    },
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
