import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from 'recharts';
import {
  Building2, TrendingUp, Users, Calendar, Phone, Mail,
  Shield, Clock, DollarSign, Wallet, Home, Store,
  BarChart3, ArrowLeft, Save, X, History, ChevronRight,
  Scale, Edit3, RotateCcw, Globe, FileText, Table2, RefreshCw,
  Sun, Moon, MapPin, ExternalLink, Briefcase,
  Plus, Trash2, AlertTriangle, Download, UserPlus, UserMinus, Palette, ChevronDown, ZoomIn, Menu,
  Gavel, FileWarning, LogOut, ShieldAlert,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useFirestoreSync } from './useFirestoreSync';
import LoginScreen from './LoginScreen';

// ─── BILINGUAL TRANSLATIONS ─────────────────────────────────────────────────

const T = {
  en: {
    greeting: 'Hello, Leomars',
    subtitle: 'Properties Portfolio Dashboard',
    dashboard: 'Dashboard',
    menuDubai: 'Dubai Properties',
    menuTurkey: 'Turkey Properties',
    history: 'History',
    lawyer: 'Lawyer',
    rentalSchedule: 'Rental Schedule',
    portfolioSummary: 'Portfolio Summary',
    totalProperties: 'Total Properties',
    turkeyProperties: 'Turkey',
    dubaiProperties: 'Dubai',
    turkeyRent: 'Turkey Rent (2026)',
    dubaiRent: 'Dubai Rent (2026)',
    portfolioUSD: 'Portfolio Value (USD)',
    totalRentCurrentYear: 'Total Rent (2026)',
    totalDeposits: 'Total Deposits',
    totalLeaseValue: 'Total Lease Value',
    avgMonthlyRent: 'Average Monthly Rent',
    monthlyRent: 'Monthly Rent',
    nextPaymentDue: 'Next Payment',
    annualRentTrendTR: 'Turkey — Annual Rent Trend (CAGR)',
    annualRentTrendDXB: 'Dubai — Annual Rent Trend (CAGR)',
    rentalIncreaseTrend: 'Rental Increase by Property',
    propertyDetails: 'Property Details',
    turkeyPortfolio: 'Turkey Portfolio',
    dubaiPortfolio: 'Dubai Portfolio',
    leaseStart: 'Lease Start',
    leaseExpiry: 'Lease Expiry',
    paymentMode: 'Payment Mode',
    deposit: 'Deposit',
    currentYearRent: 'Annual Rent',
    leaseTotal: 'Lease Total',
    tenant: 'Tenant',
    contact: 'Contact',
    email: 'Email',
    year: 'Year',
    perPayment: 'Per Payment',
    numPayments: '# Payments',
    annualTotal: 'Annual Total',
    daysRemaining: 'days left',
    leaseProgress: 'Lease Progress',
    editProperty: 'Edit Property',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    tenantDetails: 'Tenant Details',
    leaseDetails: 'Lease Details',
    annualRentBreakdown: 'Annual Rent Breakdown',
    backupCreated: 'Backup created on save',
    restoreBackup: 'Restore',
    backupHistory: 'Backup History',
    noBackups: 'No backup records yet',
    lawyerContact: 'Lawyer Contact',
    lawyerName: 'Lawyer Name',
    firm: 'Firm / Office',
    website: 'Website',
    address: 'Address',
    callNow: 'Call Now',
    sendEmail: 'Send Email',
    visitWebsite: 'Visit Website',
    openMaps: 'Open in Maps',
    notes: 'Notes',
    savedLocally: 'Saved locally',
    property: 'Property',
    totalPortfolio: 'Total',
    leaseExpirySoon: 'Expiring Soon',
    leaseExpiryTimeline: 'Lease Expiry Timeline',
    paymentSchedule: 'Payment Schedule',
    viewDetails: 'View Details',
    residential: 'Residential',
    commercial: 'Commercial',
    villa: 'Villa',
    language: 'EN',
    switchLang: '中文',
    phone: 'Phone',
    exchangeRate: 'Exchange Rate',
    liveRate: 'Live USD/TRY',
    liveRateAED: 'Live USD/AED',
    lastUpdated: 'Last updated',
    region: 'Region',
    addProperty: 'Add Property',
    deleteProperty: 'Delete',
    confirmDelete: 'Are you sure you want to delete',
    deleteWarning: 'This action cannot be undone. A backup will be created before deletion.',
    confirm: 'Confirm',
    propertyName: 'Property Name',
    propertyType: 'Property Type',
    selectRegion: 'Region',
    addYear: '+ Add Year',
    removeYear: 'Remove',
    paymentFrequency: 'Payment Frequency',
    altContactLabel: 'Alt Contact',
    leaseStartLabel: 'Lease Start',
    leaseExpiryLabel: 'Lease Expiry',
    depositLabel: 'Deposit',
    yearLabel: 'Year',
    createProperty: 'Create Property',
    exportData: 'Export',
    exportAll: 'Export All Properties',
    exportAllDesc: 'Download a complete Excel file with all properties across both regions',
    exportRegion: 'Export Region',
    exportRegionDesc: 'Download all properties for a specific region',
    exportProperty: 'Export Property',
    exportPropertyDesc: 'Download individual property data',
    exportSuccess: 'File downloaded successfully',
    selectToExport: 'Select a property to export',
    propertiesCount: 'properties',
    shopDetails: 'Shop Details',
    shopNumber: 'Shop #',
    shopTenant: 'Tenant Name',
    shopRent: 'Annual Rent',
    shopPhone: 'Phone',
    shopContract: 'Contract Period',
    editShop: 'Edit Shop',
    saveShop: 'Save',
    deleteShop: 'Delete Shop',
    addShop: 'Add Shop',
    confirmDeleteShop: 'Delete this shop?',
    deleteShopWarning: 'This will permanently remove this shop/tenant from the building.',
    shopSaved: 'Shop updated successfully',
    shopAdded: 'New shop added',
    shopDeleted: 'Shop removed',
    addFutureTenancy: 'Add',
    futureTenancy: 'Future / Next Tenancy',
    futureTenant: 'Next Tenant',
    futureRent: 'Next Rent',
    futureContract: 'Next Contract Period',
    futurePhone: 'Next Phone',
    futureNotes: 'Notes / Amendments',
    saveFuture: 'Save',
    removeFuture: 'Remove Future',
    editFuture: 'Edit',
    newTenancy: 'New Tenancy',
    endTenancy: 'End Tenancy',
    endTenancyConfirm: 'End this tenancy? The property will be marked as tenancy ended. Tenant details will be kept as old record.',
    vacant: 'Vacant',
    tenancyEndedLabel: 'TENANCY ENDED',
    endedOn: 'Ended on',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    passwordChanged: 'Password changed successfully!',
    passwordMismatch: 'New passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    updatePassword: 'Update Password',
    existingProperties: 'Existing Properties',
    forReference: 'for reference',
    newTenancyTitle: 'New Tenancy',
    newTenancyDesc: 'Update tenant details for a new tenant or renew the lease for an existing tenant.',
    tenancyType: 'Tenancy Type',
    newTenant: 'New Tenant (Replacement)',
    leaseRenewal: 'Lease Renewal (Same Tenant)',
    newTenantName: 'New Tenant Name',
    newPhone: 'Phone Number',
    newEmail: 'Email Address',
    newAltContact: 'Alt Contact',
    newLeaseStart: 'New Lease Start',
    newLeaseExpiry: 'New Lease Expiry',
    newDeposit: 'Deposit Amount',
    renewalYears: 'Renewal Rent Schedule',
    applyTenancy: 'Apply Tenancy',
    previousTenant: 'Previous Tenant',
    currentDetails: 'Current Details',
    lawyerDetails: 'Lawyer Details',
    legalCases: 'Legal Cases',
    addCase: 'Add Case',
    editCase: 'Edit Case',
    deleteCase: 'Delete Case',
    caseTitle: 'Case Title',
    caseProperty: 'Property',
    caseStatus: 'Status',
    caseDate: 'Date Filed',
    caseDescription: 'Description',
    caseNotes: 'Notes',
    caseOpen: 'Open',
    caseClosed: 'Closed',
    casePending: 'Pending',
    caseInProgress: 'In Progress',
    saveCase: 'Save Case',
    confirmDeleteCase: 'Delete this legal case?',
    deleteCaseWarning: 'This action cannot be undone.',
    noCases: 'No legal cases recorded',
    legalCase: 'Legal Case',
    nearExpiry: 'Near Expiry',
    selectProperty: 'Select Property',
  },
  cn: {
    greeting: '你好, Leomars',
    subtitle: '物业投资组合仪表盘',
    dashboard: '仪表盘',
    menuDubai: '迪拜物业',
    menuTurkey: '土耳其物业',
    history: '历史记录',
    lawyer: '律师',
    rentalSchedule: '租赁明细表',
    portfolioSummary: '物业投资组合总览',
    totalProperties: '物业总数',
    turkeyProperties: '土耳其',
    dubaiProperties: '迪拜',
    turkeyRent: '土耳其租金 (2026)',
    dubaiRent: '迪拜租金 (2026)',
    portfolioUSD: '投资组合价值 (USD)',
    totalRentCurrentYear: '当年租金总额 (2026)',
    totalDeposits: '押金总额',
    totalLeaseValue: '租约总价值',
    avgMonthlyRent: '平均月租金',
    monthlyRent: '月租金',
    nextPaymentDue: '下次付款',
    annualRentTrendTR: '土耳其 — 年度租金趋势 (CAGR)',
    annualRentTrendDXB: '迪拜 — 年度租金趋势 (CAGR)',
    rentalIncreaseTrend: '各物业租金增长趋势',
    propertyDetails: '物业详情',
    turkeyPortfolio: '土耳其物业组合',
    dubaiPortfolio: '迪拜物业组合',
    leaseStart: '租约开始日',
    leaseExpiry: '租约到期日',
    paymentMode: '付款方式',
    deposit: '押金',
    currentYearRent: '年度租金',
    leaseTotal: '租约合计',
    tenant: '租户姓名',
    contact: '联系方式',
    email: '电邮',
    year: '年份',
    perPayment: '每期金额',
    numPayments: '付款次数',
    annualTotal: '年度合计',
    daysRemaining: '天剩余',
    leaseProgress: '租约进度',
    editProperty: '编辑物业',
    save: '保存',
    cancel: '取消',
    back: '返回',
    tenantDetails: '租户详情',
    leaseDetails: '租约详情',
    annualRentBreakdown: '年度租金明细',
    backupCreated: '保存时已创建备份',
    restoreBackup: '恢复',
    backupHistory: '备份历史',
    noBackups: '暂无备份记录',
    lawyerContact: '律师联系方式',
    lawyerName: '律师姓名',
    firm: '律所 / 办公室',
    website: '网站',
    address: '地址',
    callNow: '立即拨打',
    sendEmail: '发送邮件',
    visitWebsite: '访问网站',
    openMaps: '在地图中打开',
    notes: '备注',
    savedLocally: '已本地保存',
    property: '物业',
    totalPortfolio: '合计',
    leaseExpirySoon: '即将到期',
    leaseExpiryTimeline: '租约到期时间线',
    paymentSchedule: '付款计划',
    viewDetails: '查看详情',
    residential: '住宅',
    commercial: '商业',
    villa: '别墅',
    language: '中文',
    switchLang: 'EN',
    phone: '电话',
    exchangeRate: '汇率',
    liveRate: '实时 USD/TRY',
    liveRateAED: '实时 USD/AED',
    lastUpdated: '最后更新',
    region: '地区',
    addProperty: '添加物业',
    deleteProperty: '删除',
    confirmDelete: '确定要删除吗',
    deleteWarning: '此操作无法撤销。删除前将自动创建备份。',
    confirm: '确认',
    propertyName: '物业名称',
    propertyType: '物业类型',
    selectRegion: '地区',
    addYear: '+ 添加年份',
    removeYear: '移除',
    paymentFrequency: '付款频率',
    altContactLabel: '备用联系人',
    leaseStartLabel: '租约开始',
    leaseExpiryLabel: '租约到期',
    depositLabel: '押金',
    yearLabel: '年份',
    createProperty: '创建物业',
    exportData: '导出',
    exportAll: '导出所有物业',
    exportAllDesc: '下载包含两个地区所有物业的完整Excel文件',
    exportRegion: '按地区导出',
    exportRegionDesc: '下载特定地区的所有物业数据',
    exportProperty: '导出物业',
    exportPropertyDesc: '下载单个物业数据',
    exportSuccess: '文件下载成功',
    selectToExport: '选择要导出的物业',
    propertiesCount: '个物业',
    shopDetails: '店铺详情',
    shopNumber: '店铺编号',
    shopTenant: '租户姓名',
    shopRent: '年租金',
    shopPhone: '电话',
    shopContract: '合同期限',
    editShop: '编辑店铺',
    saveShop: '保存',
    deleteShop: '删除店铺',
    addShop: '添加店铺',
    confirmDeleteShop: '确定删除此店铺？',
    deleteShopWarning: '这将永久移除该店铺/租户。',
    shopSaved: '店铺更新成功',
    shopAdded: '新店铺已添加',
    shopDeleted: '店铺已移除',
    addFutureTenancy: '添加',
    futureTenancy: '未来 / 下期租约',
    futureTenant: '下任租户',
    futureRent: '下期租金',
    futureContract: '下期合同期限',
    futurePhone: '下期电话',
    futureNotes: '备注 / 修改',
    saveFuture: '保存',
    removeFuture: '移除未来租约',
    editFuture: '编辑',
    newTenancy: '新租约',
    endTenancy: '结束租约',
    endTenancyConfirm: '结束此租约？物业将标记为租约已结束。租户信息将作为历史记录保留。',
    vacant: '空置',
    tenancyEndedLabel: '租约已结束',
    endedOn: '结束于',
    changePassword: '更改密码',
    currentPassword: '当前密码',
    newPassword: '新密码',
    confirmNewPassword: '确认新密码',
    passwordChanged: '密码修改成功！',
    passwordMismatch: '新密码不匹配',
    passwordTooShort: '密码至少6个字符',
    updatePassword: '更新密码',
    existingProperties: '现有物业',
    forReference: '仅供参考',
    newTenancyTitle: '新租约',
    newTenancyDesc: '为新租户更新租户信息，或为现有租户续签租约。',
    tenancyType: '租约类型',
    newTenant: '新租户（更换）',
    leaseRenewal: '续签租约（原租户）',
    newTenantName: '新租户姓名',
    newPhone: '电话号码',
    newEmail: '电子邮件',
    newAltContact: '备用联系人',
    newLeaseStart: '新租约开始日',
    newLeaseExpiry: '新租约到期日',
    newDeposit: '押金金额',
    renewalYears: '续签租金明细',
    applyTenancy: '应用租约',
    previousTenant: '上一任租户',
    currentDetails: '当前详情',
    lawyerDetails: '律师详情',
    legalCases: '法律案件',
    addCase: '添加案件',
    editCase: '编辑案件',
    deleteCase: '删除案件',
    caseTitle: '案件标题',
    caseProperty: '物业',
    caseStatus: '状态',
    caseDate: '立案日期',
    caseDescription: '描述',
    caseNotes: '备注',
    caseOpen: '未结',
    caseClosed: '已结',
    casePending: '待处理',
    caseInProgress: '进行中',
    saveCase: '保存案件',
    confirmDeleteCase: '确认删除此法律案件？',
    deleteCaseWarning: '此操作无法撤销。',
    noCases: '暂无法律案件记录',
    legalCase: '法律案件',
    nearExpiry: '即将到期',
    selectProperty: '选择物业',
  },
};

// ─── DATA (from Excel) ──────────────────────────────────────────────────────

const DEFAULT_PROPERTIES = [
  // ── TURKEY ──────────────────────────────────────────
  {
    id: 1, name: 'My Home 182', type: 'residential', region: 'turkey', currency: 'TRY',
    tenant: 'Nilufer Bahriye Eyelkovan', phone: '0541 841 3117',
    email: 'nulku@dogusgrubu.com.tr', payment: '6 payments / year',
    paymentCN: '每年6次付款',
    leaseStart: '2020-01-15', leaseExpiry: '2026-12-31', deposit: 4750,
    rentSchedule: [
      { year: 2021, perPayment: 4750, numPayments: 6, annual: 28500 },
      { year: 2022, perPayment: 5500, numPayments: 6, annual: 33000 },
      { year: 2023, perPayment: 7500, numPayments: 6, annual: 45000 },
      { year: 2024, perPayment: 9500, numPayments: 6, annual: 57000 },
      { year: 2025, perPayment: 17000, numPayments: 6, annual: 102000 },
      { year: 2026, perPayment: 24000, numPayments: 6, annual: 144000 },
    ],
    currentYearRent: 144000, leaseTotal: 409500,
  },
  {
    id: 2, name: 'Greenox 302', type: 'residential', region: 'turkey', currency: 'TRY',
    tenant: 'Erdem Emir ER', phone: '0542 256 1283', email: null,
    payment: '12 payments / year', paymentCN: '每年12次付款',
    leaseStart: '2021-01-01', leaseExpiry: '2027-01-31', deposit: 3000,
    rentSchedule: [
      { year: 2021, perPayment: 3000, numPayments: 12, annual: 36000 },
      { year: 2022, perPayment: 3520, numPayments: 12, annual: 42240 },
      { year: 2023, perPayment: 5000, numPayments: 12, annual: 60000 },
      { year: 2024, perPayment: 6500, numPayments: 12, annual: 78000 },
      { year: 2025, perPayment: 10530, numPayments: 12, annual: 126360 },
      { year: 2026, perPayment: 14450, numPayments: 12, annual: 173400 },
    ],
    currentYearRent: 173400, leaseTotal: 516000,
  },
  {
    id: 3, name: 'Anthill 809', type: 'residential', region: 'turkey', currency: 'TRY',
    tenant: 'Myriem Kadmiri', phone: '539 291 9487',
    email: null, altContact: 'Emad Abou Ltaif 534 486 0112',
    payment: '12 payments / year', paymentCN: '每年12次付款',
    leaseStart: '2022-11-20', leaseExpiry: '2025-11-20', deposit: 5950,
    rentSchedule: [
      { year: 2021, perPayment: 5950, numPayments: 12, annual: 71400 },
      { year: 2022, perPayment: 7000, numPayments: 12, annual: 84000 },
      { year: 2023, perPayment: 10000, numPayments: 12, annual: 120000 },
      { year: 2024, perPayment: 10000, numPayments: 12, annual: 120000 },
      { year: 2025, perPayment: 16200, numPayments: 12, annual: 194400 },
      { year: 2026, perPayment: 22680, numPayments: 12, annual: 272160 },
    ],
    currentYearRent: 272160, leaseTotal: 861960,
  },
  {
    id: 4, name: 'Anthill 2201', type: 'residential', region: 'turkey', currency: 'TRY',
    tenant: 'Rabia Chaabet', phone: '534 551 5048',
    email: 'Robyroro1289@gmail.com',
    payment: '12 payments / year', paymentCN: '每年12次付款',
    leaseStart: '2020-01-01', leaseExpiry: '2027-02-16', deposit: 5500,
    rentSchedule: [
      { year: 2021, perPayment: 6000, numPayments: 12, annual: 72000 },
      { year: 2022, perPayment: 7176, numPayments: 12, annual: 86112 },
      { year: 2023, perPayment: 9000, numPayments: 12, annual: 108000 },
      { year: 2024, perPayment: 9000, numPayments: 12, annual: 108000 },
      { year: 2025, perPayment: 9000, numPayments: 12, annual: 108000 },
      { year: 2026, perPayment: 9000, numPayments: 12, annual: 108000 },
    ],
    currentYearRent: 108000, leaseTotal: 590112,
  },
  {
    id: 5, name: 'Greenox 1301', type: 'residential', region: 'turkey', currency: 'TRY',
    tenant: 'Mert Kahyaoglu', phone: '506 416 6516',
    email: 'mkahyag@gmail.com',
    payment: '12 payments / year', paymentCN: '每年12次付款',
    leaseStart: '2023-01-01', leaseExpiry: '2027-02-28', deposit: 3000,
    rentSchedule: [
      { year: 2021, perPayment: 3360, numPayments: 12, annual: 40320 },
      { year: 2022, perPayment: 4100, numPayments: 12, annual: 49200 },
      { year: 2023, perPayment: 6000, numPayments: 12, annual: 72000 },
      { year: 2024, perPayment: 10000, numPayments: 12, annual: 120000 },
      { year: 2025, perPayment: 16500, numPayments: 12, annual: 198000 },
      { year: 2026, perPayment: 23000, numPayments: 12, annual: 276000 },
    ],
    currentYearRent: 276000, leaseTotal: 755520,
  },
  {
    id: 6, name: 'Cadde Life Shop', type: 'commercial', region: 'turkey', currency: 'TRY',
    tenant: 'Hassan Ali', phone: '+90 535 975 62 62',
    email: 'yagiz.vagcom@icloud.com',
    payment: '4 payments / year', paymentCN: '每年4次付款',
    leaseStart: '2024-01-01', leaseExpiry: '2026-11-30', deposit: 50000,
    rentSchedule: [
      { year: 2025, perPayment: 150000, numPayments: 4, annual: 600000 },
      { year: 2026, perPayment: 195000, numPayments: 4, annual: 780000 },
    ],
    currentYearRent: 780000, leaseTotal: 1380000,
  },
  // ── DUBAI ───────────────────────────────────────────
  {
    id: 7, name: 'Business Bay Shop', type: 'commercial', region: 'dubai', currency: 'AED',
    tenant: 'Wing Star Car Rental LLC', phone: '056 344 6449',
    email: '', payment: '4 payments / year', paymentCN: '每年4次付款',
    leaseStart: '2025-10-20', leaseExpiry: '2026-10-19', deposit: 20000,
    rentSchedule: [
      { year: 2025, perPayment: 100000, numPayments: 4, annual: 400000 },
      { year: 2026, perPayment: 100000, numPayments: 4, annual: 400000 },
    ],
    currentYearRent: 400000, leaseTotal: 400000,
  },
  {
    id: 8, name: 'Damac Villa 125', type: 'residential', region: 'dubai', currency: 'AED',
    tenant: 'Andrezej Zdzislaw Ofman', phone: '',
    email: '', payment: '3 payments / year', paymentCN: '每年3次付款',
    leaseStart: '2025-03-20', leaseExpiry: '2026-03-19', deposit: 100000,
    rentSchedule: [
      { year: 2025, perPayment: 193333, numPayments: 3, annual: 580000 },
      { year: 2026, perPayment: 193333, numPayments: 3, annual: 580000 },
    ],
    currentYearRent: 580000, leaseTotal: 580000,
  },
  {
    id: 9, name: 'Mira 270', type: 'residential', region: 'dubai', currency: 'AED',
    tenant: 'Beniamin Cinco', phone: '',
    email: '', payment: '4 payments / year', paymentCN: '每年4次付款',
    leaseStart: '2026-02-14', leaseExpiry: '2027-02-13', deposit: 0,
    rentSchedule: [
      { year: 2025, perPayment: 50000, numPayments: 4, annual: 200000 },
      { year: 2026, perPayment: 50000, numPayments: 4, annual: 200000 },
    ],
    currentYearRent: 200000, leaseTotal: 400000,
  },
  // ── New Dubai Properties (from Excel files) ──────────────────────────────
  {
    id: 10, name: 'JLT 3001', type: 'residential', region: 'dubai', currency: 'AED',
    tenant: 'Multiple Tenants (Bed-space)', phone: '',
    email: '', payment: '12 payments / year', paymentCN: '每年12次付款',
    leaseStart: '2025-01-01', leaseExpiry: '2026-01-01', deposit: 0,
    rentSchedule: [
      { year: 2022, perPayment: 11833, numPayments: 3, annual: 35500 },
      { year: 2023, perPayment: 13021, numPayments: 12, annual: 156250 },
      { year: 2024, perPayment: 13497, numPayments: 12, annual: 161965 },
      { year: 2025, perPayment: 15493, numPayments: 12, annual: 185910 },
      { year: 2026, perPayment: 15800, numPayments: 1, annual: 15800 },
    ],
    currentYearRent: 189600, leaseTotal: 555425,
  },
  {
    id: 11, name: 'C9 Shops', type: 'commercial', region: 'dubai', currency: 'AED', units: 18,
    tenant: 'Pasons / Happy Zone / Others', phone: '056 344 6449',
    email: '', payment: '4 payments / year', paymentCN: '每年4次付款',
    leaseStart: '2020-06-01', leaseExpiry: '2026-05-31', deposit: 0,
    rentSchedule: [
      { year: 2021, perPayment: 168694, numPayments: 4, annual: 674774 },
      { year: 2022, perPayment: 187747, numPayments: 4, annual: 750989 },
      { year: 2023, perPayment: 206530, numPayments: 4, annual: 826119 },
      { year: 2024, perPayment: 237508, numPayments: 4, annual: 950030 },
      { year: 2025, perPayment: 266893, numPayments: 4, annual: 1067571 },
      { year: 2026, perPayment: 290288, numPayments: 4, annual: 1161150 },
    ],
    currentYearRent: 1161150, leaseTotal: 5430633,
    shops: [
      { shop: 'S-1,2,3,4,5,6,7', tenant: 'Pasons 29 Super Market', phone: '056 344 6449', contract: 'Jun 25 – May 26', rent: 382536 },
      { shop: 'S-8,9,10', tenant: 'Pasons 29 Super Market', phone: '058 508 6666', contract: 'Nov 25 – Nov 26', rent: 296993 },
      { shop: 'S-11,13,18,20,22', tenant: 'Happy Zone Cafe LLC', phone: '055 552 8823', contract: 'Feb 25 – Feb 26', rent: 268837 },
      { shop: 'S-12', tenant: 'Xuezhe Li', phone: '050 888 5938', contract: 'Aug 25 – Aug 26', rent: 81807 },
      { shop: 'S-14', tenant: 'Zehao Huang', phone: '050 913 6888', contract: 'Jul 25 – Jun 26', rent: 47405 },
      { shop: 'S-16', tenant: 'Xuezhe Li', phone: '050 888 5938', contract: 'Jul 25 – Jul 26', rent: 83572 },
    ],
  },
  {
    id: 12, name: 'X14 Shops', type: 'commercial', region: 'dubai', currency: 'AED', units: 5,
    tenant: 'Mashrabiya Coffee Shop', phone: '054 505 0542',
    email: '', payment: '4 payments / year', paymentCN: '每年4次付款',
    leaseStart: '2020-10-09', leaseExpiry: '2026-10-08', deposit: 0,
    rentSchedule: [
      { year: 2021, perPayment: 40000, numPayments: 4, annual: 160000 },
      { year: 2022, perPayment: 50000, numPayments: 4, annual: 200000 },
      { year: 2023, perPayment: 50000, numPayments: 4, annual: 200000 },
      { year: 2024, perPayment: 57500, numPayments: 4, annual: 230000 },
      { year: 2025, perPayment: 60375, numPayments: 4, annual: 241500 },
      { year: 2026, perPayment: 64625, numPayments: 4, annual: 258500 },
    ],
    currentYearRent: 258500, leaseTotal: 1290000,
    shops: [
      { shop: 'S-9,11,16,18,20', tenant: 'Mashrabiya Coffee Shop', phone: '054 505 0542', contract: 'Oct 25 – Oct 26', rent: 258500 },
    ],
  },
  {
    id: 13, name: 'Y18 Shops', type: 'commercial', region: 'dubai', currency: 'AED', units: 5,
    tenant: 'Bright Way / Food Palace', phone: '055 523 6204',
    email: '', payment: '4 payments / year', paymentCN: '每年4次付款',
    leaseStart: '2020-04-01', leaseExpiry: '2026-10-10', deposit: 14500,
    rentSchedule: [
      { year: 2021, perPayment: 41250, numPayments: 4, annual: 165000 },
      { year: 2022, perPayment: 45125, numPayments: 4, annual: 180500 },
      { year: 2023, perPayment: 62750, numPayments: 4, annual: 251000 },
      { year: 2024, perPayment: 63500, numPayments: 4, annual: 254000 },
      { year: 2025, perPayment: 69625, numPayments: 4, annual: 278500 },
      { year: 2026, perPayment: 72875, numPayments: 4, annual: 291500 },
    ],
    currentYearRent: 291500, leaseTotal: 1420500,
    shops: [
      { shop: 'S-07,09,14,16', tenant: 'Bright Way Super Market LLC', phone: '055 523 6204', contract: 'Jun 25 – May 26', rent: 252000, deposit: 12000 },
      { shop: 'S-11', tenant: 'Food Palace', phone: '', contract: 'Oct 25 – Oct 26', rent: 39500, deposit: 2500 },
    ],
  },
  {
    id: 14, name: 'I01 Shops', type: 'commercial', region: 'dubai', currency: 'AED', units: 8,
    tenant: 'Multiple Tenants (8 Shops)', phone: '',
    email: '', payment: '4 payments / year', paymentCN: '每年4次付款',
    leaseStart: '2021-01-01', leaseExpiry: '2027-01-31', deposit: 0,
    rentSchedule: [
      { year: 2022, perPayment: 69875, numPayments: 4, annual: 279500 },
      { year: 2023, perPayment: 77125, numPayments: 4, annual: 308499 },
      { year: 2024, perPayment: 83870, numPayments: 4, annual: 335480 },
      { year: 2025, perPayment: 97534, numPayments: 4, annual: 390134 },
      { year: 2026, perPayment: 102892, numPayments: 4, annual: 411566 },
    ],
    currentYearRent: 411566, leaseTotal: 1725179,
    shops: [
      { shop: 'S-01', tenant: 'Deli Bite Catering Services', phone: '052 119 8506', contract: 'Jul 25 – Jul 26', rent: 58190 },
      { shop: 'S-02', tenant: 'Matar Saif / Saleem Kattil', phone: '056 876 7757', contract: 'Mar 25 – Mar 26', rent: 63500 },
      { shop: 'S-03', tenant: 'Abdul Hmaid / Emirates World', phone: '052 699 9934', contract: 'Jan 26 – Jan 27', rent: 58080 },
      { shop: 'S-04', tenant: 'Alhakaya Pharmacy LLC', phone: '050 737 9662', contract: 'Nov 25 – Nov 26', rent: 56000 },
      { shop: 'S-06', tenant: 'Al Hashim Gents Saloon', phone: '052 668 3355', contract: 'Sep 25 – Sep 26', rent: 42000 },
      { shop: 'S-08', tenant: 'Noor Al Shams Laundry', phone: '050 735 0373', contract: 'Feb 26 – Jan 27', rent: 46752 },
      { shop: 'S-10', tenant: 'Rihlat Al Madina Mini Mart', phone: '055 563 7484', contract: 'Nov 25 – Oct 26', rent: 50000 },
      { shop: 'S-12', tenant: 'Lassi Village', phone: '050 718 1656', contract: 'Aug 25 – Aug 26', rent: 37044 },
    ],
  },
  {
    id: 15, name: 'B04 Shops', type: 'commercial', region: 'dubai', currency: 'AED', units: 3,
    tenant: 'Haipeng Yu / Yuan Chao Trading', phone: '050 810 2188',
    email: '', payment: '4 payments / year', paymentCN: '每年4次付款',
    leaseStart: '2020-07-01', leaseExpiry: '2026-12-31', deposit: 0,
    rentSchedule: [
      { year: 2022, perPayment: 33500, numPayments: 4, annual: 134000 },
      { year: 2023, perPayment: 38097, numPayments: 4, annual: 152388 },
      { year: 2024, perPayment: 40691, numPayments: 4, annual: 162764 },
      { year: 2025, perPayment: 42096, numPayments: 4, annual: 168384 },
      { year: 2026, perPayment: 30847, numPayments: 4, annual: 123387 },
    ],
    currentYearRent: 123387, leaseTotal: 740923,
    shops: [
      { shop: 'S-9,18', tenant: 'Haipeng Yu', phone: '', contract: 'Jul 25 – Jul 26', rent: 123387 },
      { shop: 'S-16', tenant: 'Yuan Chao General Trading', phone: '050 810 2188', contract: 'Jan 26 – Dec 26', rent: 0 },
    ],
  },
];

// ─── FINTECH CHART PALETTE ──────────────────────────────────────────────────
// Bloomberg / Robinhood / Revolut inspired — clear separation, premium dark-mode feel
const PROPERTY_COLORS = {
  // Turkey properties — warm-cool balanced set
  'My Home 182':      '#00C9A7',   // teal mint
  'Greenox 302':      '#22D3EE',   // bright cyan
  'Anthill 809':      '#FF6B6B',   // soft coral
  'Anthill 2201':     '#FCC419',   // vivid gold
  'Greenox 1301':     '#339AF0',   // bright blue
  'Cadde Life Shop':  '#FF922B',   // warm orange
  // Dubai properties — complementary vibrant set
  'Business Bay Shop':'#DA77F2',   // orchid purple
  'Damac Villa 125':  '#20C997',   // emerald
  'Mira 270':         '#F783AC',   // blush pink
  'JLT 3001':         '#4DABF7',   // cerulean
  'C9 Shops':         '#A9E34B',   // lime
  'X14 Shops':        '#FF8787',   // salmon
  'Y18 Shops':        '#74C0FC',   // sky
  'I01 Shops':        '#B197FC',   // lavender
  'B04 Shops':        '#FFD43B',   // sunflower
};
const EXTRA_COLORS = [
  '#63E6BE', '#E599F7', '#FFA94D', '#66D9E8', '#D0BFFF',
  '#8CE99A', '#FFC9C9', '#A5D8FF', '#FFEC99', '#F06595',
];
const getPropertyColor = (name) => {
  if (PROPERTY_COLORS[name]) return PROPERTY_COLORS[name];
  const used = new Set(Object.values(PROPERTY_COLORS));
  const avail = EXTRA_COLORS.find(c => !used.has(c));
  return avail || EXTRA_COLORS[Object.keys(PROPERTY_COLORS).length % EXTRA_COLORS.length];
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

const fmtTRY = (v) => v == null ? 'N/A' : 'TRY ' + v.toLocaleString('tr-TR');
const fmtAED = (v) => v == null ? 'N/A' : 'AED ' + v.toLocaleString('en-US');
const fmtCurr = (v, currency) => currency === 'AED' ? fmtAED(v) : fmtTRY(v);
const fmtUSD = (v, rate) => {
  if (v == null || !rate) return '';
  return 'USD ' + (v / rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
const toUSD = (v, currency, tryRate, aedRate) => {
  if (v == null) return 0;
  const r = currency === 'AED' ? aedRate : tryRate;
  return r ? v / r : 0;
};

const PAYMENT_FREQ_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const leaseProgress = (start, end) => {
  const s = new Date(start), e = new Date(end), now = new Date();
  return Math.min(100, Math.max(0, ((now - s) / (e - s)) * 100));
};

const daysRemaining = (expiry) =>
  Math.ceil((new Date(expiry) - new Date()) / 86400000);

const getNextPaymentDate = (property) => {
  const currentSchedule = property.rentSchedule.find(r => r.year === new Date().getFullYear())
    || property.rentSchedule[property.rentSchedule.length - 1];
  if (!currentSchedule) return null;
  const n = currentSchedule.numPayments;
  const start = new Date(property.leaseStart);
  const now = new Date();
  const year = now.getFullYear();
  const startDay = start.getDate();
  const intervalMonths = Math.round(12 / n);
  const dates = [];
  for (let i = 0; i < n; i++) {
    dates.push(new Date(year, i * intervalMonths, startDay));
  }
  const upcoming = dates.filter(d => d >= now);
  if (upcoming.length > 0) return upcoming[0];
  return new Date(year + 1, 0, startDay);
};

const fmtDate = (d) => {
  if (!d) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getChartData = (props) => {
  const years = [...new Set(props.flatMap(p => p.rentSchedule.map(r => r.year)))].sort();
  const data = years.map(year => {
    const row = { year: year.toString() };
    props.forEach(p => {
      const schedule = p.rentSchedule.find(s => s.year === year);
      row[p.name] = schedule ? schedule.annual : 0;
    });
    return row;
  });
  // Compute CAGR% and total for each year bar
  if (data.length > 0) {
    const propNames = props.map(p => p.name);
    const totals = data.map(row => propNames.reduce((s, k) => s + (row[k] || 0), 0));
    const baseTotal = totals[0];
    const baseYear = parseInt(data[0].year);
    data.forEach((row, i) => {
      row._total = totals[i];
      if (i === 0 || baseTotal <= 0) {
        row._cagr = null;
      } else {
        const n = parseInt(row.year) - baseYear;
        if (n > 0 && totals[i] > 0) {
          row._cagr = (Math.pow(totals[i] / baseTotal, 1 / n) - 1) * 100;
        } else {
          row._cagr = null;
        }
      }
    });
  }
  return data;
};

// Custom label renderer for CAGR% on top of stacked bars
const CagrLabel = ({ x, y, width, index, data, accentColor }) => {
  if (!data || !data[index]) return null;
  const row = data[index];
  const cagr = row._cagr;
  // Show "CAGR%" text on the first bar (index 0)
  if (index === 0) {
    return (
      <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={9} fontWeight={700}
        fill={accentColor} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        CAGR%
      </text>
    );
  }
  if (cagr == null) return null;
  const pct = `${cagr >= 0 ? '+' : ''}${cagr.toFixed(1)}%`;
  return (
    <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={9} fontWeight={700}
      fill={accentColor} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
      {pct}
    </text>
  );
};

// ─── EXCHANGE RATE HOOK ─────────────────────────────────────────────────────
// Fetches live rates from multiple free APIs (tries in order until one succeeds)
// Refreshes automatically every 12 hours + on app open

const AED_PEGGED = 3.6725;           // UAE dirham is pegged ~3.6725 per USD
const TRY_FALLBACK = 43.92;          // Updated Mar 2026 fallback

// Google Finance URLs (used for clickable links)
const GOOGLE_FX_TRY = 'https://www.google.com/finance/quote/USD-TRY';
const GOOGLE_FX_AED = 'https://www.google.com/finance/quote/USD-AED';

const CNY_FALLBACK = 6.87;            // Updated Mar 2026 fallback

const RATE_APIS = [
  {
    name: 'google-fxratesapi',
    url: 'https://api.fxratesapi.com/latest?base=USD&currencies=TRY,AED,CNY&resolution=1m',
    parse: (d) => ({ try: d?.rates?.TRY, aed: d?.rates?.AED, cny: d?.rates?.CNY }),
  },
  {
    name: 'exchangerate-api',
    url: 'https://api.exchangerate-api.com/v4/latest/USD',
    parse: (d) => ({ try: d?.rates?.TRY, aed: d?.rates?.AED, cny: d?.rates?.CNY }),
  },
  {
    name: 'open.er-api',
    url: 'https://open.er-api.com/v6/latest/USD',
    parse: (d) => ({ try: d?.rates?.TRY, aed: d?.rates?.AED, cny: d?.rates?.CNY }),
  },
  {
    name: 'currencyapi-cf',
    url: 'https://latest.currency-api.pages.dev/v1/currencies/usd.json',
    parse: (d) => ({ try: d?.usd?.try, aed: d?.usd?.aed, cny: d?.usd?.cny }),
  },
  {
    name: 'frankfurter',
    url: 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=TRY,CNY',
    parse: (d) => ({ try: d?.rates?.TRY, aed: null, cny: d?.rates?.CNY }),
  },
  {
    name: 'currencyapi-gh',
    url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    parse: (d) => ({ try: d?.usd?.try, aed: d?.usd?.aed, cny: d?.usd?.cny }),
  },
];

const useExchangeRate = () => {
  // Restore last known rates from localStorage on mount
  const cached = (() => { try { return JSON.parse(localStorage.getItem('leomars_fx') || 'null'); } catch { return null; } })();
  const [rate, setRate] = useState(cached?.try || null);
  const [aedRate, setAedRate] = useState(cached?.aed || null);
  const [cnyRate, setCnyRate] = useState(cached?.cny || null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(cached ? 'cached' : null);
  const [source, setSource] = useState(cached ? 'cached' : null);

  const fetchRate = useCallback(async () => {
    setLoading(true);
    const ts = Date.now();
    for (const api of RATE_APIS) {
      try {
        const sep = api.url.includes('?') ? '&' : '?';
        const res = await fetch(`${api.url}${sep}_t=${ts}`, {
          signal: AbortSignal.timeout(8000),
          cache: 'no-store',
        });
        if (!res.ok) continue;
        const data = await res.json();
        const parsed = api.parse(data);
        if (parsed.try && parsed.try > 1) {
          const tryRate = parsed.try;
          const aed = parsed.aed && parsed.aed > 1 ? parsed.aed : AED_PEGGED;
          const cny = parsed.cny && parsed.cny > 1 ? parsed.cny : CNY_FALLBACK;
          setRate(tryRate);
          setAedRate(aed);
          setCnyRate(cny);
          setLastUpdated(new Date().toLocaleTimeString());
          setSource(api.name);
          setLoading(false);
          // Cache for next page load
          try { localStorage.setItem('leomars_fx', JSON.stringify({ try: tryRate, aed, cny, ts })); } catch {}
          return;
        }
      } catch { /* try next API */ }
    }
    // All APIs failed — keep previous rate or use fallback
    setRate(prev => prev || TRY_FALLBACK);
    setAedRate(prev => prev || AED_PEGGED);
    setCnyRate(prev => prev || CNY_FALLBACK);
    setLastUpdated(null);
    setSource('offline');
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 12 * 60 * 60 * 1000);  // Refresh every 12 hours
    return () => clearInterval(interval);
  }, [fetchRate]);

  return { rate, aedRate, cnyRate, loading, lastUpdated, source, refresh: fetchRate };
};

// ─── STACKED BAR ROUNDED TOP SHAPE ──────────────────────────────────────────
const StackedBarShape = (allKeys) => (props) => {
  const { x, y, width, height, fill, payload, dataKey } = props;
  if (!width || !height || height <= 0) return null;
  const myIdx = allKeys.indexOf(dataKey);
  const isTop = allKeys.slice(myIdx + 1).every(k => !payload[k] || payload[k] === 0);
  if (isTop) {
    const r = Math.min(6, height / 2, width / 2);
    return <path d={`M${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} L${x},${y + height} Z`} fill={fill} />;
  }
  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
};

// ─── DUAL CURRENCY DISPLAY ──────────────────────────────────────────────────

const Dual = ({ value, rate, aedRate, currency = 'TRY', className = '', size = 'md' }) => {
  if (value == null) return <span className={className}>N/A</span>;
  const activeRate = currency === 'AED' ? aedRate : rate;
  const sizes = {
    xs: { main: 'text-[10px] sm:text-xs', usd: 'text-[9px] sm:text-[10px]' },
    sm: { main: 'text-xs sm:text-sm', usd: 'text-[10px] sm:text-xs' },
    md: { main: 'text-sm', usd: 'text-[10px] sm:text-xs' },
    lg: { main: 'text-base sm:text-lg', usd: 'text-xs sm:text-sm' },
    xl: { main: 'text-xl sm:text-2xl md:text-3xl', usd: 'text-xs sm:text-sm' },
    kpi: { main: 'text-lg sm:text-xl md:text-2xl', usd: 'text-[10px] sm:text-xs md:text-sm' },
  };
  const s = sizes[size] || sizes.md;
  return (
    <span className={`inline-flex flex-col min-w-0 ${className}`}>
      <span className={`font-bold th-text truncate ${s.main}`}>{fmtCurr(value, currency)}</span>
      {activeRate && <span className={`text-[#0ECB81]/80 font-medium truncate ${s.usd}`}>{fmtUSD(value, activeRate)}</span>}
    </span>
  );
};

// ─── LOCAL STORAGE ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'leomars_properties';
const BACKUP_KEY = 'leomars_backups';
const DELETED_KEY = 'leomars_deleted_ids';
const DATA_VERSION_KEY = 'leomars_data_version';
const DATA_VERSION = 6;  // Bump this when DEFAULT_PROPERTIES data changes

const loadDeletedIds = () => {
  try { return JSON.parse(localStorage.getItem(DELETED_KEY) || '[]'); } catch { return []; }
};
const saveDeletedIds = (ids) => localStorage.setItem(DELETED_KEY, JSON.stringify(ids));

const loadProperties = () => {
  try {
    // If data version changed, reset to defaults (picks up corrected data)
    const storedVersion = parseInt(localStorage.getItem(DATA_VERSION_KEY) || '0', 10);
    if (storedVersion < DATA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(DATA_VERSION_KEY, String(DATA_VERSION));
      return DEFAULT_PROPERTIES;
    }
    const d = localStorage.getItem(STORAGE_KEY);
    if (!d) return DEFAULT_PROPERTIES;
    const parsed = JSON.parse(d);
    const deletedIds = loadDeletedIds();
    const ids = parsed.map(p => p.id);
    const migrated = parsed.map(p => {
      const def = DEFAULT_PROPERTIES.find(dp => dp.id === p.id);
      if (!def) return p; // User-added property — keep as-is
      // Defaults as base (picks up any NEW fields), stored values override (preserves user edits)
      // For data corrections (deposits, rent, etc.) bump DATA_VERSION to force full reset
      const merged = { ...def, ...p };
      merged.region = merged.region || 'turkey';
      merged.currency = merged.currency || 'TRY';
      merged.units = merged.units ?? def.units ?? 1;
      return merged;
    });
    // Add any new default properties not yet in storage (skip user-deleted ones)
    DEFAULT_PROPERTIES.forEach(dp => {
      if (!ids.includes(dp.id) && !deletedIds.includes(dp.id)) migrated.push(dp);
    });
    return migrated;
  } catch { return DEFAULT_PROPERTIES; }
};

const saveProperties = (props) => localStorage.setItem(STORAGE_KEY, JSON.stringify(props));

const loadBackups = () => {
  try { const d = localStorage.getItem(BACKUP_KEY); return d ? JSON.parse(d) : []; } catch { return []; }
};

const saveBackup = (props, label) => {
  const backups = loadBackups();
  backups.unshift({ date: new Date().toISOString(), label, data: JSON.parse(JSON.stringify(props)) });
  if (backups.length > 20) backups.length = 20;
  localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
};

// ─── EXCEL EXPORT HELPERS ───────────────────────────────────────────────────

const fmtNum = (v) => typeof v === 'number' ? v.toLocaleString('en-US') : v;
const fmtCur = (v, cur) => typeof v === 'number' ? `${cur} ${v.toLocaleString('en-US')}` : v;
const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const exportProperties = async (properties, filename, t) => {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  // ── SUMMARY SHEET ──
  const sumRows = [];
  sumRows.push(['LEOMARS PROPERTIES — PORTFOLIO REPORT']);
  sumRows.push([`Generated: ${today()}`, '', '', `Total Properties/Units: ${properties.reduce((s,p) => s + (p.units || 1), 0)}`]);
  sumRows.push([]);
  const hdr = ['#', t.property, t.propertyType, t.region, 'Currency', t.tenant, t.phone, t.email, t.leaseStart, t.leaseExpiry, t.deposit, t.paymentMode, t.currentYearRent, t.leaseTotal];
  sumRows.push(hdr);
  properties.forEach((p, i) => {
    const cur = p.currency || (p.region === 'dubai' ? 'AED' : 'TRY');
    sumRows.push([
      i + 1, p.name, p.type === 'commercial' ? t.commercial : t.residential,
      p.region === 'dubai' ? 'Dubai' : 'Turkey', cur, p.tenancyEnded ? 'VACANT' : p.tenant, p.tenancyEnded ? '—' : (p.phone || '—'), p.tenancyEnded ? '—' : (p.email || '—'),
      p.leaseStart, p.leaseExpiry, fmtCur(p.deposit, cur), p.payment,
      fmtCur(p.currentYearRent, cur), fmtCur(p.leaseTotal, cur),
    ]);
  });
  sumRows.push([]);
  const dubaiProps = properties.filter(p => p.region === 'dubai');
  const turkeyProps = properties.filter(p => p.region === 'turkey');
  sumRows.push(['TOTALS']);
  if (turkeyProps.length > 0) {
    sumRows.push(['', 'Turkey Annual Rent', '', '', '', '', '', '', '', '', '', '',
      fmtCur(turkeyProps.reduce((s, p) => s + (p.currentYearRent || 0), 0), 'TRY'), '']);
  }
  if (dubaiProps.length > 0) {
    sumRows.push(['', 'Dubai Annual Rent', '', '', '', '', '', '', '', '', '', '',
      fmtCur(dubaiProps.reduce((s, p) => s + (p.currentYearRent || 0), 0), 'AED'), '']);
  }
  const ws = XLSX.utils.aoa_to_sheet(sumRows);
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 13 } }];
  ws['!cols'] = [
    { wch: 4 }, { wch: 24 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 22 },
    { wch: 16 }, { wch: 24 }, { wch: 13 }, { wch: 13 }, { wch: 16 }, { wch: 14 },
    { wch: 18 }, { wch: 18 },
  ];
  ws['!rows'] = [{ hpt: 28 }, { hpt: 18 }, { hpt: 10 }, { hpt: 22 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Portfolio Summary');

  // ── INDIVIDUAL PROPERTY SHEETS ──
  properties.forEach(p => {
    const cur = p.currency || (p.region === 'dubai' ? 'AED' : 'TRY');
    const rows = [];
    rows.push([`${p.name.toUpperCase()} — PROPERTY REPORT`]);
    rows.push([`Region: ${p.region === 'dubai' ? 'Dubai' : 'Turkey'}`, '', `Currency: ${cur}`, '', `Type: ${p.type === 'commercial' ? t.commercial : t.residential}`]);
    rows.push([]);
    rows.push(['TENANT DETAILS']);
    rows.push(['Name', p.tenancyEnded ? 'VACANT' : p.tenant]);
    rows.push(['Status', p.tenancyEnded ? `Vacant since ${p.tenancyEndDate || 'N/A'}` : 'Active']);
    rows.push(['Phone', p.tenancyEnded ? '—' : (p.phone || '—')]);
    rows.push(['Email', p.tenancyEnded ? '—' : (p.email || '—')]);
    if (!p.tenancyEnded && p.altContact) rows.push(['Alt Contact', p.altContact]);
    rows.push([]);
    rows.push(['LEASE DETAILS']);
    rows.push(['Lease Start', p.leaseStart]);
    rows.push(['Lease Expiry', p.leaseExpiry]);
    rows.push(['Payment Mode', p.payment]);
    rows.push(['Deposit', fmtCur(p.deposit, cur)]);
    rows.push(['Annual Rent (Current)', fmtCur(p.currentYearRent, cur)]);
    rows.push(['Total Lease Value', fmtCur(p.leaseTotal, cur)]);
    rows.push([]);
    rows.push(['RENT SCHEDULE']);
    rows.push([t.year, `${t.perPayment} (${cur})`, t.numPayments, `${t.annualTotal} (${cur})`]);
    p.rentSchedule.forEach(r => {
      rows.push([r.year, fmtNum(r.perPayment), r.numPayments, fmtNum(r.annual)]);
    });
    rows.push([]);
    rows.push(['', '', 'GRAND TOTAL', fmtCur(p.rentSchedule.reduce((s, r) => s + (r.annual || 0), 0), cur)]);

    const ws2 = XLSX.utils.aoa_to_sheet(rows);
    ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
    ws2['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 22 }];
    ws2['!rows'] = [{ hpt: 26 }];
    XLSX.utils.book_append_sheet(wb, ws2, p.name.substring(0, 31));
  });

  XLSX.writeFile(wb, `${filename}.xlsx`);
};

const exportSingleProperty = async (property, t) => {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  const cur = property.currency || (property.region === 'dubai' ? 'AED' : 'TRY');
  const p = property;

  // ── PROPERTY DETAILS SHEET ──
  const rows = [];
  rows.push([`${p.name.toUpperCase()} — PROPERTY REPORT`]);
  rows.push([`Generated: ${today()}`]);
  rows.push([]);
  rows.push(['══════════════════════════════════════']);
  rows.push(['PROPERTY INFORMATION']);
  rows.push(['══════════════════════════════════════']);
  rows.push(['Property Name', p.name]);
  rows.push(['Property Type', p.type === 'commercial' ? t.commercial : t.residential]);
  rows.push(['Region', p.region === 'dubai' ? 'Dubai' : 'Turkey']);
  rows.push(['Currency', cur]);
  rows.push([]);
  rows.push(['══════════════════════════════════════']);
  rows.push(['TENANT DETAILS']);
  rows.push(['══════════════════════════════════════']);
  rows.push(['Tenant Name', p.tenancyEnded ? 'VACANT' : p.tenant]);
  rows.push(['Status', p.tenancyEnded ? `Vacant since ${p.tenancyEndDate || 'N/A'}` : 'Active']);
  rows.push(['Phone', p.tenancyEnded ? '—' : (p.phone || '—')]);
  rows.push(['Email', p.tenancyEnded ? '—' : (p.email || '—')]);
  if (!p.tenancyEnded && p.altContact) rows.push(['Alt Contact', p.altContact]);
  rows.push([]);
  rows.push(['══════════════════════════════════════']);
  rows.push(['LEASE DETAILS']);
  rows.push(['══════════════════════════════════════']);
  rows.push(['Lease Start', p.leaseStart]);
  rows.push(['Lease Expiry', p.leaseExpiry]);
  rows.push(['Payment Mode', p.payment]);
  rows.push(['Security Deposit', fmtCur(p.deposit, cur)]);
  rows.push(['Annual Rent (Current Year)', fmtCur(p.currentYearRent, cur)]);
  rows.push(['Total Lease Value', fmtCur(p.leaseTotal, cur)]);

  const ws1 = XLSX.utils.aoa_to_sheet(rows);
  ws1['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  ws1['!cols'] = [{ wch: 28 }, { wch: 36 }];
  ws1['!rows'] = [{ hpt: 28 }, { hpt: 16 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Property Details');

  // ── RENT SCHEDULE SHEET ──
  const sRows = [];
  sRows.push([`${p.name.toUpperCase()} — RENT SCHEDULE`]);
  sRows.push([`Currency: ${cur}`, '', '', `Total Years: ${p.rentSchedule.length}`]);
  sRows.push([]);
  sRows.push([t.year, `${t.perPayment} (${cur})`, t.numPayments, `${t.annualTotal} (${cur})`]);
  p.rentSchedule.forEach(r => {
    sRows.push([r.year, fmtNum(r.perPayment), r.numPayments, fmtNum(r.annual)]);
  });
  sRows.push([]);
  sRows.push(['', '', 'GRAND TOTAL', fmtCur(p.rentSchedule.reduce((s, r) => s + (r.annual || 0), 0), cur)]);
  sRows.push([]);
  sRows.push([`Report generated by Leomars Properties Dashboard`]);

  const ws2 = XLSX.utils.aoa_to_sheet(sRows);
  ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
  ws2['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 14 }, { wch: 22 }];
  ws2['!rows'] = [{ hpt: 26 }, { hpt: 16 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Rent Schedule');

  XLSX.writeFile(wb, `${p.name}.xlsx`);
};

// ─── ANIMATION VARIANTS ─────────────────────────────────────────────────────

const fadeInUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };

// ─── SPLASH SCREEN ──────────────────────────────────────────────────────────

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 4200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0B0E11' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Radial glow behind logo */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(252,213,53,0.12) 0%, rgba(252,213,53,0.03) 40%, transparent 70%)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0.5] }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Particle ring */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-1 h-1 rounded-full bg-[#FCD535]"
          style={{ top: '50%', left: '50%' }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: Math.cos((i * 30) * Math.PI / 180) * 140,
            y: Math.sin((i * 30) * Math.PI / 180) * 140,
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{ duration: 2, delay: 0.8 + i * 0.05, ease: 'easeOut' }}
        />
      ))}

      {/* Logo container with 3D-like entrance */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0, rotateY: 180, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src="/logo.png" alt="Leomars Properties"
            className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain drop-shadow-[0_0_40px_rgba(252,213,53,0.3)]"
          />
        </motion.div>
      </motion.div>

      {/* Horizontal gold line */}
      <motion.div
        className="relative z-10 h-[1px] bg-gradient-to-r from-transparent via-[#FCD535] to-transparent mt-6 sm:mt-8"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '240px', opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
      />

      {/* Greeting text */}
      <div className="relative z-10 mt-5 sm:mt-6 flex flex-col items-center gap-2">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-center px-4"
          style={{ color: '#EAECEF' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Hello, <span className="gradient-text">Leomars</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl font-medium tracking-wider text-center"
          style={{ color: '#FCD535' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 2.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          你好 Nihao
        </motion.p>
      </div>

      {/* Subtitle */}
      <motion.p
        className="relative z-10 text-xs sm:text-sm mt-4 tracking-[0.25em] uppercase text-center px-4"
        style={{ color: '#848E9C' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        Properties Portfolio
      </motion.p>

      {/* Loading bar at bottom */}
      <motion.div
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[#FCD535]/60"
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ duration: 3.5, delay: 0.5, ease: 'linear' }}
      />
    </motion.div>
  );
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const FLAG_URLS = {
  tr: 'https://flagcdn.com/w40/tr.png',
  ae: 'https://flagcdn.com/w40/ae.png',
};
const Flag = ({ region, size = 16, className = '' }) => {
  const code = region === 'dubai' ? 'ae' : 'tr';
  return (
    <img src={FLAG_URLS[code]} alt={code.toUpperCase()} width={size} height={Math.round(size * 0.67)}
      className={`inline-block rounded-[2px] object-cover ${className}`}
      style={{ width: size, height: Math.round(size * 0.67) }} />
  );
};

const CustomTooltip = ({ active, payload, label, currency, rate, aedRate }) => {
  if (!active || !payload?.length) return null;
  const activeRate = currency === 'AED' ? aedRate : rate;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="chart-tooltip">
      <div className="flex items-center justify-between gap-6 mb-2.5 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-sm font-bold th-text">{label}</span>
        <span className="text-sm font-bold" style={{ color: '#FCD535' }}>
          {fmtCurr(total, currency)}
        </span>
      </div>
      {payload.filter(p => p.value > 0).map((p, i) => {
        const dotColor = PROPERTY_COLORS[p.name] || getPropertyColor(p.name);
        return (
          <div key={i} className="flex items-center gap-2.5 text-xs mb-1.5 py-1 px-1 rounded-md transition-colors" style={{ background: `${dotColor}08` }}>
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}60` }} />
            <span className="truncate flex-1 th-text font-medium">{p.name}</span>
            <span className="font-bold tabular-nums" style={{ color: dotColor }}>{fmtCurr(p.value, currency)}</span>
          </div>
        );
      })}
      {activeRate && (
        <div className="mt-2.5 pt-2.5 text-[10px] text-[#0ECB81] text-right font-semibold" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          ≈ {fmtUSD(total, activeRate)}
        </div>
      )}
    </div>
  );
};

// ─── KPI Card ───────────────────────────────────────────────────────────────

const KPICard = ({ icon: Icon, label, value, prefix = '', suffix = '', color, delay = 0, usdValue, isCount = false }) => (
  <motion.div variants={scaleIn} className="glass-card p-2.5 sm:p-5 md:p-6 flex flex-col gap-1.5 sm:gap-3 lg:justify-center min-w-0 h-full">
    <div className="flex items-center gap-1.5 sm:gap-3">
      <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0" style={{ background: `${color}20` }}>
        <Icon size={15} style={{ color }} className="sm:w-5 sm:h-5" />
      </div>
      <span className="text-[10px] sm:text-sm text-[#FCD535] font-bold leading-tight">{label}</span>
    </div>
    <div className="min-w-0">
      <div className="text-sm sm:text-xl md:text-2xl font-bold th-text leading-tight">
        {prefix}<CountUp end={value} duration={2} separator="," delay={delay} />{suffix}
      </div>
      {!isCount && usdValue != null && (
        <div className="text-[9px] sm:text-xs text-[#0ECB81]/80 font-medium mt-0.5">
          USD {Math.round(usdValue).toLocaleString('en-US')}
        </div>
      )}
    </div>
  </motion.div>
);

// ─── Property Card ──────────────────────────────────────────────────────────

const PropertyCard = ({ property, onClick, onUpdateShops, t, lang, rate, aedRate, legalCases = [], onNavigateToLawyer }) => {
  const days = daysRemaining(property.leaseExpiry);
  const isVacant = property.tenancyEnded === true;
  const isExpired = !isVacant && days <= 0;  // Vacant suppresses Expired
  const isNearExpiry = !isVacant && !isExpired && days <= 30;  // Vacant suppresses Near Expiry
  const hasLegalCase = legalCases.some(c => c.propertyId === property.id && c.status !== 'closed');
  const progress = leaseProgress(property.leaseStart, property.leaseExpiry);
  const color = PROPERTY_COLORS[property.name] || '#00C9A7';
  const isExpiring = !isVacant && days < 180;
  const isCritical = !isVacant && (days <= 0 || days < 90);
  const cur = property.currency || 'TRY';
  const activeRate = cur === 'AED' ? aedRate : rate;
  const hasShops = property.shops && property.shops.length > 0;
  const [shopOpen, setShopOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);  // { shop, index } or 'new'
  const toggleShops = (e) => { e.stopPropagation(); setShopOpen(v => !v); };

  const openShop = (shop, idx) => setSelectedShop({ shop, index: idx });
  const openAddShop = () => setSelectedShop('new');
  const closeShop = () => setSelectedShop(null);

  const handleShopSave = (updatedShop) => {
    if (!onUpdateShops) return;
    let newShops;
    if (selectedShop === 'new') {
      newShops = [...(property.shops || []), updatedShop];
    } else {
      newShops = property.shops.map((s, i) => i === selectedShop.index ? updatedShop : s);
    }
    onUpdateShops(property.id, newShops);
    closeShop();
  };

  const handleShopDelete = () => {
    if (!onUpdateShops || selectedShop === 'new') return;
    const newShops = property.shops.filter((_, i) => i !== selectedShop.index);
    onUpdateShops(property.id, newShops);
    closeShop();
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="glass-card p-4 sm:p-5 cursor-pointer group relative overflow-hidden"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Blinking EXPIRED & Legal Case overlays */}
      <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end gap-1">
        {isVacant && (
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider"
            style={{ background: 'rgba(249,115,22,0.2)', color: '#F97316', border: '1px solid rgba(249,115,22,0.4)', backdropFilter: 'blur(4px)' }}>
            <Home size={11} />
            {t.vacant}
          </motion.div>
        )}
        {isExpired && (
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider"
            style={{ background: 'rgba(246,70,93,0.2)', color: '#F6465D', border: '1px solid rgba(246,70,93,0.4)', backdropFilter: 'blur(4px)' }}>
            <AlertTriangle size={11} />
            EXPIRED
          </motion.div>
        )}
        {isNearExpiry && (
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider cursor-pointer"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
            <Clock size={11} />
            {t.nearExpiry}
          </motion.div>
        )}
        {hasLegalCase && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider cursor-pointer"
            style={{ background: 'rgba(8,145,178,0.2)', color: '#0891B2', border: '1px solid rgba(8,145,178,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { e.stopPropagation(); onNavigateToLawyer && onNavigateToLawyer(); }}>
            <Gavel size={11} />
            {t.legalCase}
          </motion.div>
        )}
      </div>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-3 mb-3 min-w-0" style={{ borderBottom: `2px solid ${color}25` }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 rounded-xl shrink-0" style={{ background: `${color}20` }}>
            {property.type === 'commercial' ? <Store size={18} style={{ color }} /> : <Home size={18} style={{ color }} />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold th-text text-sm sm:text-base truncate">{property.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                style={{ background: `${color}20`, color }}>
                {property.type === 'commercial' ? t.commercial : t.residential}
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                property.region === 'dubai'
                  ? 'bg-[#FCD535]/10 text-[#FCD535]'
                  : 'bg-[#F6465D]/12 text-[#F6465D]'
              }`}>
                <Flag region={property.region} size={14} />
              </span>
            </div>
          </div>
        </div>
        <ChevronRight size={16} className="th-text-sec transition shrink-0 mt-1" />
      </div>

      {/* Tenant */}
      <div className="pb-3 mb-3 min-w-0" style={{ borderBottom: `2px solid ${color}25` }}>
        <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
          <Users size={13} className={`shrink-0 ${property.tenancyEnded ? 'text-[#F97316]' : 'th-text-sec'}`} />
          {property.tenancyEnded ? (
            <span className="text-[#F97316] font-bold uppercase tracking-wider text-[10px]">{t.vacant}</span>
          ) : (
            <span className="truncate th-text-sec">{property.tenant}</span>
          )}
        </div>
        {!property.tenancyEnded && property.phone && (
          <div className="flex items-center gap-1.5 text-xs th-text-sec mt-1 min-w-0">
            <Phone size={11} className="shrink-0" />
            <span className="truncate">{property.phone}</span>
          </div>
        )}
        {!property.tenancyEnded && property.altContact && (
          <div className="flex items-center gap-1.5 text-xs th-text-sec mt-1 min-w-0">
            <Phone size={11} className="shrink-0" />
            <span className="truncate">{property.altContact}</span>
          </div>
        )}
      </div>

      {/* Lease Progress */}
      <div className="pb-3 mb-3" style={{ borderBottom: `2px solid ${color}25` }}>
        {isVacant ? (
          <div className="flex items-center gap-2 text-xs">
            <Home size={12} className="text-[#F97316]" />
            <span className="text-[#F97316] font-bold uppercase tracking-wider">{t.vacant}</span>
            {property.tenancyEndDate && <span className="th-text-sec font-normal normal-case">· {lang === 'cn' ? '自' : 'since'} {property.tenancyEndDate}</span>}
          </div>
        ) : (
          <>
            <div className="flex justify-between text-xs mb-1">
              <span className="th-text-sec">{t.leaseProgress}</span>
              <span className={`truncate ${isExpired ? 'text-[#F6465D] font-bold animate-pulse' : isCritical ? 'text-[#F6465D] font-semibold' : isExpiring ? 'text-[#FCD535] font-semibold' : 'text-[#FCD535]'}`}>
                {isExpired ? (lang === 'cn' ? '已过期' : 'EXPIRED') : `${days} ${t.daysRemaining}`}
              </span>
            </div>
            <div className="h-1.5 th-bg rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: isCritical ? '#F6465D' : isExpiring ? '#FCD535' : '#FCD535' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </>
        )}
      </div>

      {/* Key Figures — Binance 2×2 Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Annual Rent */}
        <div className="th-bg rounded-xl p-3 sm:p-3.5 min-w-0 text-center" style={{ borderLeft: `3px solid ${color}` }}>
          <div className="text-[10px] sm:text-xs th-text-sec font-medium mb-1 truncate">{t.currentYearRent}</div>
          <div className="text-xs sm:text-sm font-bold th-text truncate">{fmtCurr(property.currentYearRent, cur)}</div>
          {activeRate && <div className="text-[8px] sm:text-[10px] font-medium truncate" style={{ color }}>{fmtUSD(property.currentYearRent, activeRate)}</div>}
        </div>
        {/* Monthly Rent */}
        <div className="th-bg rounded-xl p-3 sm:p-3.5 min-w-0 text-center" style={{ borderLeft: `3px solid ${color}` }}>
          <div className="text-[10px] sm:text-xs th-text-sec font-medium mb-1 truncate">{t.monthlyRent}</div>
          <div className="text-xs sm:text-sm font-bold th-text truncate">{fmtCurr(Math.round(property.currentYearRent / 12), cur)}</div>
          {activeRate && <div className="text-[8px] sm:text-[10px] font-medium truncate" style={{ color }}>{fmtUSD(Math.round(property.currentYearRent / 12), activeRate)}</div>}
        </div>
        {/* Deposit */}
        <div className="th-bg rounded-xl p-3 sm:p-3.5 min-w-0 text-center" style={{ borderLeft: `3px solid ${color}` }}>
          <div className="text-[10px] sm:text-xs th-text-sec font-medium mb-1 truncate">{t.deposit}</div>
          <div className="text-xs sm:text-sm font-bold th-text truncate">{fmtCurr(property.deposit, cur)}</div>
          {activeRate && property.deposit > 0 && <div className="text-[8px] sm:text-[10px] font-medium truncate" style={{ color }}>{fmtUSD(property.deposit, activeRate)}</div>}
        </div>
        {/* Payment Mode */}
        <div className="th-bg rounded-xl p-3 sm:p-3.5 min-w-0 text-center" style={{ borderLeft: `3px solid ${color}` }}>
          <div className="text-[10px] sm:text-xs th-text-sec font-medium mb-1 truncate">{t.paymentMode}</div>
          <div className="text-xs sm:text-sm font-bold th-text truncate">{lang === 'cn' ? property.paymentCN : property.payment}</div>
        </div>
      </div>

      {/* ── Expandable Shop Breakdown (Excel-style filter) ── */}
      {hasShops && (
        <div className="mt-3 pt-3" style={{ borderTop: `2px solid ${color}25` }} onClick={(e) => e.stopPropagation()}>
          <button onClick={toggleShops}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg th-bg hover:th-bg2 transition text-xs"
            style={{ border: '1px dashed', borderColor: `${color}40` }}>
            <div className="flex items-center gap-2">
              <Store size={12} style={{ color }} />
              <span className="font-semibold truncate" style={{ color }}>{property.units} Shops Breakdown</span>
            </div>
            <div className="flex items-center gap-1.5">
              {onUpdateShops && <span className="text-[8px] th-text-sec hidden sm:inline">click row to edit</span>}
              <ChevronDown size={14} className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} style={{ color }} />
            </div>
          </button>

          <AnimatePresence>
            {shopOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${color}20` }}>
                  {/* Sub-header */}
                  <div className="grid grid-cols-12 gap-1 px-2.5 py-1.5 text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider"
                    style={{ background: `${color}12`, color }}>
                    <div className="col-span-3">Shop #</div>
                    <div className="col-span-3">Tenant</div>
                    <div className="col-span-2 text-right">Rent/Yr</div>
                    <div className="col-span-2 text-right hidden sm:block">Phone</div>
                    <div className="col-span-2 sm:col-span-2 text-right">{t.deposit}</div>
                  </div>
                  {/* Shop rows – scrollable & clickable */}
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    {property.shops.map((shop, si) => (
                      <div key={si}
                        onClick={(e) => { e.stopPropagation(); openShop(shop, si); }}
                        className="grid grid-cols-12 gap-1 px-2.5 py-1.5 text-[9px] sm:text-[10px] transition cursor-pointer hover:bg-[#FCD535]/8 group/row"
                        style={{ background: si % 2 === 0 ? `${color}06` : 'transparent', borderTop: `1px solid ${color}10` }}>
                        <div className="col-span-3 flex items-center gap-1 min-w-0">
                          <Store size={9} className="shrink-0 opacity-50 group-hover/row:opacity-100 transition" style={{ color }} />
                          <span className="th-text truncate font-medium group-hover/row:text-[#FCD535] transition">{shop.shop}</span>
                        </div>
                        <div className="col-span-3 th-text-sec truncate">{shop.tenant}</div>
                        <div className="col-span-2 text-right th-text font-medium text-[8px] sm:text-[10px] truncate">{fmtCurr(shop.rent, cur)}</div>
                        <div className="col-span-2 text-right th-text-sec hidden sm:block truncate">{shop.phone || '—'}</div>
                        <div className="col-span-2 sm:col-span-2 text-right flex items-center justify-end gap-1">
                          <span className="th-text-sec text-[8px] sm:text-[10px] truncate">{shop.deposit ? fmtCurr(shop.deposit, cur) : '—'}</span>
                          <ChevronRight size={10} className="th-text-sec opacity-0 group-hover/row:opacity-60 transition shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Total row + Add Shop button */}
                  <div className="grid grid-cols-12 gap-1 px-2.5 py-1.5 text-[9px] sm:text-[10px] font-bold"
                    style={{ background: `${color}15`, borderTop: `2px solid ${color}30` }}>
                    <div className="col-span-3" style={{ color }}>Total</div>
                    <div className="col-span-3 th-text-sec">{property.shops.length} tenants</div>
                    <div className="col-span-2 text-right" style={{ color }}>{fmtCurr(property.shops.reduce((s, sh) => s + sh.rent, 0), cur)}</div>
                    <div className="col-span-2 hidden sm:block"></div>
                    <div className="col-span-2 sm:col-span-2 flex justify-end">
                      {onUpdateShops && (
                        <button onClick={(e) => { e.stopPropagation(); openAddShop(); }}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#FCD535]/15 text-[#FCD535] text-[8px] sm:text-[9px] hover:bg-[#FCD535]/25 transition font-semibold">
                          <Plus size={10} /> {t.addShop}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Shop Detail Modal */}
      <AnimatePresence>
        {selectedShop && (
          <ShopDetailModal
            shop={selectedShop === 'new' ? null : selectedShop.shop}
            isNew={selectedShop === 'new'}
            propertyName={property.name}
            currency={cur}
            onSave={handleShopSave}
            onDelete={handleShopDelete}
            onCancel={closeShop}
            t={t}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Property Detail / Edit View ────────────────────────────────────────────

const PropertyDetailView = ({ property, onBack, onSave, onDelete, onNewTenancy, onEndTenancy, onUpdateShops, t, lang, rate, aedRate, legalCases = [], onNavigateToLawyer }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(JSON.parse(JSON.stringify(property)));
  const [selectedShop, setSelectedShop] = useState(null); // { shop, index } or 'new'
  const color = PROPERTY_COLORS[property.name] || '#00C9A7';
  const cur = property.currency || 'TRY';
  const activeRate = cur === 'AED' ? aedRate : rate;
  const hasShops = property.shops && property.shops.length > 0;

  const handleSave = () => { onSave(form); setEditing(false); };
  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const updateScheduleField = (idx, key, val) => {
    setForm(prev => {
      const schedule = [...prev.rentSchedule];
      schedule[idx] = { ...schedule[idx], [key]: Number(val) || 0 };
      if (key === 'perPayment' || key === 'numPayments') {
        schedule[idx].annual = schedule[idx].perPayment * schedule[idx].numPayments;
      }
      return { ...prev, rentSchedule: schedule };
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="max-w-4xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <button onClick={onBack} className="flex items-center gap-2 th-text-sec th-hover-t transition text-sm">
          <ArrowLeft size={18} /> {t.back}
        </button>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCD535]/15 text-[#FCD535] rounded-lg text-xs hover:bg-[#FCD535]/20 transition">
                <Save size={14} /> {t.save}
              </button>
              <button onClick={() => { setEditing(false); setForm(JSON.parse(JSON.stringify(property))); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6465D]/15 text-[#F6465D] rounded-lg text-xs hover:bg-[#F6465D]/20 transition">
                <X size={14} /> {t.cancel}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onNewTenancy && onNewTenancy(property)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#845EF7]/15 text-[#845EF7] rounded-lg text-xs hover:bg-[#845EF7]/20 transition">
                <UserPlus size={14} /> {t.newTenancy}
              </button>
              <button onClick={() => onEndTenancy && onEndTenancy(property)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316]/15 text-[#F97316] rounded-lg text-xs hover:bg-[#F97316]/20 transition">
                <UserMinus size={14} /> {t.endTenancy}
              </button>
              <button onClick={() => onDelete && onDelete(property)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6465D]/15 text-[#F6465D] rounded-lg text-xs hover:bg-[#F6465D]/20 transition">
                <Trash2 size={14} /> {t.deleteProperty}
              </button>
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 th-bg2 th-text rounded-lg text-xs th-hover2 transition">
                <Edit3 size={14} /> {t.editProperty}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Property Header */}
      <div className="glass-card p-5 sm:p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl" style={{ background: `${color}20` }}>
            {property.type === 'commercial' ? <Store size={24} style={{ color }} /> : <Home size={24} style={{ color }} />}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold th-text truncate max-w-[200px] sm:max-w-none">{property.name}</h2>
              {!property.tenancyEnded && daysRemaining(property.leaseExpiry) <= 0 && (
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ background: 'rgba(246,70,93,0.15)', color: '#F6465D', border: '1px solid rgba(246,70,93,0.3)' }}>
                  <AlertTriangle size={11} /> EXPIRED
                </motion.div>
              )}
              {!property.tenancyEnded && daysRemaining(property.leaseExpiry) > 0 && daysRemaining(property.leaseExpiry) <= 30 && (
                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <Clock size={11} /> {t.nearExpiry}
                </motion.div>
              )}
              {legalCases.some(c => c.propertyId === property.id && c.status !== 'closed') && (
                <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider cursor-pointer hover:scale-105 transition-transform"
                  style={{ background: 'rgba(8,145,178,0.15)', color: '#0891B2', border: '1px solid rgba(8,145,178,0.3)' }}
                  onClick={() => onNavigateToLawyer && onNavigateToLawyer()}>
                  <Gavel size={11} /> {t.legalCase}
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
                {property.type === 'commercial' ? t.commercial : t.residential}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                property.region === 'dubai' ? 'bg-[#FCD535]/10 text-[#FCD535]' : 'bg-[#F6465D]/12 text-[#F6465D]'
              }`}>
                <Flag region={property.region} size={12} /> {property.region === 'dubai' ? 'Dubai' : 'Turkey'} · {cur}
              </span>
            </div>
          </div>
        </div>

        {/* Tenant section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold th-text-sec">{t.tenantDetails}</h3>
            {property.tenancyEnded && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>
                <Home size={11} />
                {t.vacant}
                {property.tenancyEndDate && <span className="font-normal normal-case ml-1">· {lang === 'cn' ? '自' : 'since'} {property.tenancyEndDate}</span>}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs th-text-sec">{t.tenant}</label>
              {editing ? <input value={form.tenant} onChange={e => updateField('tenant', e.target.value)}
                className="w-full th-bg border th-border rounded-lg px-3 py-2 th-text text-sm mt-1" />
                : <p className={`text-sm mt-1 truncate ${property.tenancyEnded ? 'text-[#F97316] font-bold uppercase' : 'th-text'}`}>
                    {property.tenancyEnded ? t.vacant : property.tenant}
                  </p>}
            </div>
            <div>
              <label className="text-xs th-text-sec">{t.phone}</label>
              {editing ? <input value={form.phone} onChange={e => updateField('phone', e.target.value)}
                className="w-full th-bg border th-border rounded-lg px-3 py-2 th-text text-sm mt-1" />
                : <p className="th-text text-sm mt-1 truncate">{property.tenancyEnded ? '—' : (property.phone || '—')}</p>}
            </div>
            {(property.email || editing) && !property.tenancyEnded && (
              <div>
                <label className="text-xs th-text-sec">{t.email}</label>
                {editing ? <input value={form.email || ''} onChange={e => updateField('email', e.target.value)}
                  className="w-full th-bg border th-border rounded-lg px-3 py-2 th-text text-sm mt-1" />
                  : <p className="th-text text-sm mt-1 truncate">{property.email || '—'}</p>}
              </div>
            )}
            {property.altContact && !property.tenancyEnded && (
              <div>
                <label className="text-xs th-text-sec">{lang === 'cn' ? '备用联系人' : 'Alt Contact'}</label>
                <p className="th-text text-sm mt-1 truncate">{property.altContact}</p>
              </div>
            )}
          </div>
        </div>

        {/* Lease section */}
        <div>
          <h3 className="text-sm font-semibold th-text-sec mb-2">{t.leaseDetails}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="th-bg rounded-xl p-2.5 sm:p-3 min-w-0 overflow-hidden text-center">
              <div className="text-[10px] sm:text-xs th-text-sec truncate">{t.leaseStart}</div>
              {editing ? <input type="date" value={form.leaseStart} onChange={e => updateField('leaseStart', e.target.value)}
                className="w-full bg-transparent th-text text-sm mt-1 text-center" />
                : <div className="th-text text-sm font-medium mt-1 truncate">{property.leaseStart}</div>}
            </div>
            <div className="th-bg rounded-xl p-2.5 sm:p-3 relative min-w-0 overflow-hidden text-center">
              <div className="text-[10px] sm:text-xs th-text-sec truncate">{t.leaseExpiry}</div>
              {editing ? <input type="date" value={form.leaseExpiry} onChange={e => updateField('leaseExpiry', e.target.value)}
                className="w-full bg-transparent th-text text-sm mt-1 text-center" />
                : <div className={`text-sm font-medium mt-1 truncate ${!property.tenancyEnded && daysRemaining(property.leaseExpiry) <= 0 ? 'text-[#F6465D]' : 'th-text'}`}>
                    {property.leaseExpiry}
                    {!property.tenancyEnded && daysRemaining(property.leaseExpiry) <= 0 && (
                      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="ml-1.5 text-[8px] font-extrabold uppercase tracking-wider text-[#F6465D]">
                        EXPIRED
                      </motion.span>
                    )}
                  </div>}
            </div>
            <div className="th-bg rounded-xl p-2.5 sm:p-3 min-w-0 overflow-hidden text-center">
              <div className="text-[10px] sm:text-xs th-text-sec truncate">{t.deposit}</div>
              <Dual value={property.deposit} rate={rate} aedRate={aedRate} currency={cur} size="sm" />
            </div>
            <div className="th-bg rounded-xl p-2.5 sm:p-3 min-w-0 overflow-hidden text-center">
              <div className="text-[10px] sm:text-xs th-text-sec truncate">{t.paymentMode}</div>
              <div className="th-text text-sm font-medium mt-1 truncate">{lang === 'cn' ? property.paymentCN : property.payment}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Annual Rent Breakdown Table */}
      <div className="glass-card p-5 sm:p-6 mb-4">
        <h3 className="text-base sm:text-lg font-bold th-text mb-4 flex items-center gap-2">
          <Table2 size={18} className="text-[#FCD535]" /> {t.annualRentBreakdown}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b th-border">
                <th className="text-left th-text-sec font-medium py-2 px-2 text-xs">{t.year}</th>
                <th className="text-right th-text-sec font-medium py-2 px-2 text-xs">{t.perPayment}</th>
                <th className="text-right th-text-sec font-medium py-2 px-2 text-xs">{t.numPayments}</th>
                <th className="text-right th-text-sec font-medium py-2 px-2 text-xs">{t.annualTotal}</th>
              </tr>
            </thead>
            <tbody>
              {(editing ? form.rentSchedule : property.rentSchedule).map((row, idx) => (
                <tr key={row.year} className="border-b th-border-l th-hover-l transition">
                  <td className="py-2 px-2 th-text font-medium">{row.year}</td>
                  <td className="py-2 px-2 text-right">
                    {editing ? <input type="number" value={row.perPayment}
                      onChange={e => updateScheduleField(idx, 'perPayment', e.target.value)}
                      className="w-24 th-bg border th-border rounded px-2 py-1 th-text text-right text-xs ml-auto block" />
                      : <Dual value={row.perPayment} rate={rate} aedRate={aedRate} currency={cur} size="xs" className="items-end" />}
                  </td>
                  <td className="py-2 px-2 text-right th-text-sec">
                    {editing ? (
                      <select value={row.numPayments} onChange={e => updateScheduleField(idx, 'numPayments', e.target.value)}
                        className="w-16 th-bg border th-border rounded px-1 py-1 th-text text-right text-xs ml-auto block">
                        {PAYMENT_FREQ_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    ) : row.numPayments}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <Dual value={row.annual} rate={rate} aedRate={aedRate} currency={cur} size="sm" className="items-end" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 th-border-s">
                <td colSpan="3" className="py-3 px-2 text-[#FCD535] font-bold text-sm">{t.leaseTotal}</td>
                <td className="py-3 px-2 text-right">
                  <span className="inline-flex flex-col items-end">
                    <span className="text-[#FCD535] font-bold text-base truncate">{fmtCurr((editing ? form.rentSchedule : property.rentSchedule).reduce((sum, r) => sum + r.annual, 0), cur)}</span>
                    {activeRate && <span className="text-[#0ECB81]/80 text-xs font-medium">{fmtUSD((editing ? form.rentSchedule : property.rentSchedule).reduce((sum, r) => sum + r.annual, 0), activeRate)}</span>}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Shops Breakdown (if multi-unit property) ── */}
      {hasShops && (
        <div className="glass-card p-5 sm:p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold th-text flex items-center gap-2">
              <Store size={18} style={{ color }} /> <span className="truncate">{property.units} Shops Breakdown</span>
            </h3>
            {onUpdateShops && (
              <button onClick={() => setSelectedShop('new')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCD535]/15 text-[#FCD535] rounded-lg text-xs hover:bg-[#FCD535]/20 transition">
                <Plus size={14} /> {t.addShop}
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b th-border">
                  <th className="text-left th-text-sec font-medium py-2 px-2 text-xs">{t.shopNumber}</th>
                  <th className="text-left th-text-sec font-medium py-2 px-2 text-xs">{t.shopTenant}</th>
                  <th className="text-right th-text-sec font-medium py-2 px-2 text-xs">{t.shopRent}</th>
                  <th className="text-right th-text-sec font-medium py-2 px-2 text-xs hidden sm:table-cell">{t.shopPhone}</th>
                  <th className="text-right th-text-sec font-medium py-2 px-2 text-xs">{t.deposit}</th>
                </tr>
              </thead>
              <tbody>
                {property.shops.map((shop, si) => (
                  <tr key={si}
                    onClick={() => setSelectedShop({ shop, index: si })}
                    className="border-b th-border-l th-hover-l transition cursor-pointer group/detrow">
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <Store size={13} style={{ color }} className="opacity-50 group-hover/detrow:opacity-100 transition" />
                        <span className="th-text font-medium group-hover/detrow:text-[#FCD535] transition truncate">{shop.shop}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 th-text-sec truncate max-w-[120px]">{shop.tenant}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="inline-flex flex-col items-end">
                        <span className="th-text font-medium" style={{ color }}>{fmtCurr(shop.rent, cur)}</span>
                        {activeRate && <span className="text-[#0ECB81]/80 text-[10px]">{fmtUSD(shop.rent, activeRate)}</span>}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right th-text-sec hidden sm:table-cell truncate max-w-[100px]">{shop.phone || '—'}</td>
                    <td className="py-2.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="th-text-sec truncate">{shop.deposit ? fmtCurr(shop.deposit, cur) : '—'}</span>
                        <ChevronRight size={13} className="th-text-sec opacity-0 group-hover/detrow:opacity-60 transition" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 th-border-s">
                  <td className="py-2.5 px-2 font-bold text-sm" style={{ color }}>Total</td>
                  <td className="py-2.5 px-2 th-text-sec text-sm">{property.shops.length} tenants</td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="inline-flex flex-col items-end">
                      <span className="font-bold text-sm" style={{ color }}>{fmtCurr(property.shops.reduce((s, sh) => s + sh.rent, 0), cur)}</span>
                      {activeRate && <span className="text-[#0ECB81]/80 text-[10px]">{fmtUSD(property.shops.reduce((s, sh) => s + sh.rent, 0), activeRate)}</span>}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell"></td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="font-bold text-sm" style={{ color }}>{fmtCurr(property.shops.reduce((s, sh) => s + (sh.deposit || 0), 0), cur)}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Shop Detail Modal */}
      <AnimatePresence>
        {selectedShop && (
          <ShopDetailModal
            shop={selectedShop === 'new' ? null : selectedShop.shop}
            isNew={selectedShop === 'new'}
            propertyName={property.name}
            currency={cur}
            onSave={(updatedShop) => {
              if (!onUpdateShops) return;
              let newShops;
              if (selectedShop === 'new') {
                newShops = [...(property.shops || []), updatedShop];
              } else {
                newShops = property.shops.map((s, i) => i === selectedShop.index ? updatedShop : s);
              }
              onUpdateShops(property.id, newShops);
              setSelectedShop(null);
            }}
            onDelete={() => {
              if (!onUpdateShops || selectedShop === 'new') return;
              const newShops = property.shops.filter((_, i) => i !== selectedShop.index);
              onUpdateShops(property.id, newShops);
              setSelectedShop(null);
            }}
            onCancel={() => setSelectedShop(null)}
            t={t}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Backup History View ────────────────────────────────────────────────────

const BackupHistoryView = ({ onBack, onRestore, t }) => {
  const backups = loadBackups();
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 th-text-sec th-hover-t transition text-sm mb-6">
        <ArrowLeft size={18} /> {t.back}
      </button>
      <h2 className="text-xl font-bold th-text mb-4 flex items-center gap-2">
        <History size={20} className="text-[#FCD535]" /> {t.backupHistory}
      </h2>
      {backups.length === 0 ? (
        <div className="glass-card p-8 text-center th-text-sec">{t.noBackups}</div>
      ) : (
        <div className="space-y-3">
          {backups.map((b, i) => (
            <div key={i} className="glass-card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="th-text text-sm font-medium truncate">{b.label}</div>
                <div className="th-text-sec text-xs">{new Date(b.date).toLocaleString()}</div>
              </div>
              <button onClick={() => onRestore(b.data)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCD535]/12 text-[#FCD535] rounded-lg text-xs hover:bg-[#FCD535]/18 transition shrink-0">
                <RotateCcw size={13} /> {t.restoreBackup}
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ─── Lawyer Contact View ────────────────────────────────────────────────────

const LAWYER_DATA = {
  name: 'Arslan Tenha',
  title: 'Turkish Lawyer',
  role: 'Owner | Tenha Law Firm',
  phone: '+90 (0) 532 505 3130',
  email: 'info@tenha.av.tr',
  website: 'https://tenha.av.tr/',
  address: 'Alemdag Cad., Centro, A Block No:2/1, Beylikduzu Istanbul',
};

const CASE_STATUSES = ['open', 'in_progress', 'pending', 'closed'];
const CASE_STATUS_COLORS = { open: '#F6465D', in_progress: '#F59E0B', pending: '#845EF7', closed: '#0ECB81' };

// ─── CHANGE PASSWORD VIEW ────────────────────────────────────────────────────
const ChangePasswordView = ({ onBack, t, lang, userEmail }) => {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage('');

    if (newPw.length < 6) {
      setStatus('error');
      setMessage(t.passwordTooShort);
      return;
    }
    if (newPw !== confirmPw) {
      setStatus('error');
      setMessage(t.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate then update password
      const { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth');
      const auth = getAuth();
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPw);
      setStatus('success');
      setMessage(t.passwordChanged);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      setStatus('error');
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setMessage(lang === 'cn' ? '当前密码不正确' : 'Current password is incorrect');
      } else if (err.code === 'auth/too-many-requests') {
        setMessage(lang === 'cn' ? '尝试次数过多，请稍后再试' : 'Too many attempts. Please try again later.');
      } else {
        setMessage(lang === 'cn' ? '密码更改失败' : 'Failed to change password. Please try again.');
      }
    }
    setLoading(false);
  };

  const inputClass = "w-full th-bg border th-border rounded-xl px-4 py-3 th-text text-sm mt-1.5 outline-none focus:ring-1 focus:ring-[#2ec4b6]/40 transition";

  return (
    <motion.div key="changePassword" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl th-bg2 th-hover2 transition">
          <ArrowLeft size={18} className="th-text" />
        </button>
        <h2 className="text-lg sm:text-xl font-bold th-text flex items-center gap-2">
          <ShieldAlert size={20} className="text-[#F97316]" /> {t.changePassword}
        </h2>
      </div>

      <div className="glass-card p-6 sm:p-8 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert size={28} className="text-[#F97316]" />
          </div>
          <p className="th-text font-bold text-base">{t.changePassword}</p>
          <p className="th-text-sec text-xs mt-1">{userEmail}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold th-text-sec uppercase tracking-wider">{t.currentPassword}</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
              required placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold th-text-sec uppercase tracking-wider">{t.newPassword}</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
              required placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold th-text-sec uppercase tracking-wider">{t.confirmNewPassword}</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              required placeholder="••••••••" className={inputClass} />
          </div>

          {status && (
            <div className={`p-3 rounded-xl text-sm font-semibold text-center ${
              status === 'success' ? 'bg-[#2ec4b6]/15 text-[#2ec4b6] border border-[#2ec4b6]/30' : 'bg-[#e63946]/15 text-[#e63946] border border-[#e63946]/30'
            }`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition ${
              loading ? 'bg-[#F97316]/30 text-[#F97316]/50 cursor-not-allowed' : 'bg-[#F97316] text-white hover:bg-[#F97316]/90'
            }`}>
            {loading ? (lang === 'cn' ? '更新中...' : 'Updating...') : t.updatePassword}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const LawyerContactView = ({ onBack, t, lang, properties, legalCases = [], onSaveCases }) => {
  const L = LAWYER_DATA;
  const [editingCase, setEditingCase] = useState(null); // null | 'new' | caseObj
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const emptyCase = { id: '', title: '', propertyId: '', status: 'open', dateFiled: new Date().toISOString().slice(0, 10), description: '', notes: '' };
  const [form, setForm] = useState(emptyCase);
  const statusLabel = (s) => ({ open: t.caseOpen, closed: t.caseClosed, pending: t.casePending, in_progress: t.caseInProgress }[s] || s);

  const openAdd = () => { setForm({ ...emptyCase, id: `case_${Date.now()}` }); setEditingCase('new'); };
  const openEdit = (c) => { setForm({ ...c }); setEditingCase(c); };
  const closeForm = () => { setEditingCase(null); setForm(emptyCase); };
  const handleSave = () => {
    if (!form.title.trim() || !form.propertyId) return;
    let updated;
    if (editingCase === 'new') {
      updated = [...legalCases, { ...form }];
    } else {
      updated = legalCases.map(c => c.id === form.id ? { ...form } : c);
    }
    onSaveCases(updated);
    closeForm();
  };
  const handleDelete = (id) => {
    onSaveCases(legalCases.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };
  const getPropertyName = (pid) => (properties || []).find(p => p.id === pid)?.name || pid;

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 th-text-sec th-hover-t transition text-sm mb-6">
        <ArrowLeft size={18} /> {t.back}
      </button>

      {/* ═══ SECTION 1: LAWYER DETAILS ═══ */}
      <h2 className="text-xl font-bold th-text mb-4 flex items-center gap-2">
        <Scale size={20} className="text-[#FCD535]" /> {t.lawyerDetails}
      </h2>

      <div className="glass-card p-5 sm:p-7 mb-8">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FCD535]/10 flex items-center justify-center shrink-0 border border-[#FCD535]/15">
            <Scale size={28} className="text-[#FCD535]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold th-text truncate">{L.name}</h3>
            <p className="text-xs sm:text-sm text-[#FCD535] font-medium truncate">{L.title}</p>
            <p className="text-xs th-text-sec flex items-center gap-1 mt-0.5 truncate">
              <Briefcase size={11} className="shrink-0" /> {L.role}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl th-bg border th-border">
            <div className="p-2 rounded-lg bg-[#FCD535]/15 shrink-0"><Phone size={16} className="text-[#FCD535]" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] th-text-sec uppercase tracking-wider truncate">{t.phone}</p>
              <p className="text-sm th-text font-medium truncate">{L.phone}</p>
            </div>
            <a href={`tel:${L.phone.replace(/[\s()]/g, '')}`}
              className="px-3 py-1.5 rounded-lg bg-[#FCD535]/15 text-[#FCD535] text-xs font-medium hover:bg-[#FCD535]/25 transition flex items-center gap-1.5 shrink-0">
              <Phone size={12} /> {t.callNow}
            </a>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl th-bg border th-border">
            <div className="p-2 rounded-lg bg-blue-500/15 shrink-0"><Mail size={16} className="text-blue-400" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] th-text-sec uppercase tracking-wider truncate">{t.email}</p>
              <p className="text-sm th-text font-medium truncate">{L.email}</p>
            </div>
            <a href={`mailto:${L.email}`}
              className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition flex items-center gap-1.5 shrink-0">
              <Mail size={12} /> {t.sendEmail}
            </a>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl th-bg border th-border">
            <div className="p-2 rounded-lg bg-purple-500/15 shrink-0"><Globe size={16} className="text-purple-400" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] th-text-sec uppercase tracking-wider">{t.website}</p>
              <p className="text-sm th-text font-medium truncate">{L.website.replace('https://', '')}</p>
            </div>
            <a href={L.website} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-purple-500/15 text-purple-400 text-xs font-medium hover:bg-purple-500/25 transition flex items-center gap-1.5 shrink-0">
              <ExternalLink size={12} /> {t.visitWebsite}
            </a>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl th-bg border th-border">
            <div className="p-2 rounded-lg bg-[#F6465D]/12 shrink-0"><MapPin size={16} className="text-[#F6465D]" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] th-text-sec uppercase tracking-wider">{t.address}</p>
              <p className="text-sm th-text font-medium leading-snug line-clamp-2 overflow-hidden">{L.address}</p>
            </div>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(L.address)}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#F6465D]/12 text-[#F6465D] text-xs font-medium hover:bg-red-500/25 transition flex items-center gap-1.5 shrink-0">
              <MapPin size={12} /> {t.openMaps}
            </a>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 2: LEGAL CASES ═══ */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold th-text flex items-center gap-2">
          <Gavel size={20} className="text-[#F6465D]" /> {t.legalCases}
          {legalCases.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F6465D]/15 text-[#F6465D]">
              {legalCases.filter(c => c.status !== 'closed').length} {t.caseOpen.toLowerCase()}
            </span>
          )}
        </h2>
        <button onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6465D]/15 text-[#F6465D] text-xs font-bold hover:bg-[#F6465D]/25 transition">
          <Plus size={14} /> {t.addCase}
        </button>
      </div>

      {/* ── Case List ── */}
      {legalCases.length === 0 && !editingCase ? (
        <div className="glass-card p-8 text-center mb-4">
          <Gavel size={40} className="mx-auto mb-3 th-text-sec opacity-30" />
          <p className="th-text-sec text-sm">{t.noCases}</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {legalCases.map(c => (
            <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 sm:p-5 relative overflow-hidden">
              {/* Status left stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: CASE_STATUS_COLORS[c.status] || '#848E9C' }} />
              <div className="pl-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-bold th-text flex items-center gap-2 min-w-0">
                      <Gavel size={14} className="shrink-0" style={{ color: CASE_STATUS_COLORS[c.status] }} />
                      <span className="truncate">{c.title}</span>
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: `${CASE_STATUS_COLORS[c.status]}15`, color: CASE_STATUS_COLORS[c.status], border: `1px solid ${CASE_STATUS_COLORS[c.status]}25` }}>
                        {statusLabel(c.status)}
                      </span>
                      <span className="text-[10px] sm:text-xs th-text-sec flex items-center gap-1 truncate max-w-[120px]">
                        <Building2 size={11} className="shrink-0" /> {getPropertyName(c.propertyId)}
                      </span>
                      <span className="text-[10px] sm:text-xs th-text-sec flex items-center gap-1">
                        <Calendar size={11} /> {c.dateFiled}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => openEdit(c)}
                      className="p-1.5 rounded-lg th-bg th-hover2 transition" title={t.editCase}>
                      <Edit3 size={13} className="th-text-sec" />
                    </button>
                    <button onClick={() => setDeleteConfirm(c.id)}
                      className="p-1.5 rounded-lg bg-[#F6465D]/10 hover:bg-[#F6465D]/20 transition" title={t.deleteCase}>
                      <Trash2 size={13} className="text-[#F6465D]" />
                    </button>
                  </div>
                </div>
                {c.description && (
                  <p className="text-xs sm:text-sm th-text-sec mt-1 leading-relaxed line-clamp-3 overflow-hidden">{c.description}</p>
                )}
                {c.notes && (
                  <div className="mt-2 p-2 rounded-lg th-bg text-[10px] sm:text-xs th-text-sec italic">
                    <FileText size={10} className="inline mr-1" />{c.notes}
                  </div>
                )}
              </div>

              {/* Delete confirmation overlay */}
              <AnimatePresence>
                {deleteConfirm === c.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-10 rounded-xl"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
                    <div className="text-center p-4">
                      <p className="text-sm font-bold text-white mb-1">{t.confirmDeleteCase}</p>
                      <p className="text-xs text-gray-400 mb-3">{t.deleteCaseWarning}</p>
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition">
                          {t.cancel}
                        </button>
                        <button onClick={() => handleDelete(c.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#F6465D] text-white text-xs font-bold hover:bg-[#F6465D]/80 transition">
                          {t.deleteCase}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Case Form ── */}
      <AnimatePresence>
        {editingCase && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="glass-card p-5 sm:p-6 mb-4 border-2"
            style={{ borderColor: 'rgba(246,70,93,0.2)' }}>
            <h3 className="text-base font-bold th-text mb-4 flex items-center gap-2">
              <Gavel size={16} className="text-[#F6465D]" />
              {editingCase === 'new' ? t.addCase : t.editCase}
            </h3>
            <div className="space-y-3">
              {/* Title */}
              <div>
                <label className="text-[10px] th-text-sec uppercase tracking-wider font-semibold mb-1 block">{t.caseTitle} *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-transparent th-text text-sm p-2.5 rounded-lg th-bg border th-border focus:outline-none focus:border-[#F6465D]/40"
                  placeholder={lang === 'cn' ? '输入案件标题...' : 'Enter case title...'} />
              </div>
              {/* Property */}
              <div>
                <label className="text-[10px] th-text-sec uppercase tracking-wider font-semibold mb-1 block">{t.caseProperty} *</label>
                <select value={form.propertyId} onChange={e => setForm(f => ({ ...f, propertyId: e.target.value }))}
                  className="w-full bg-transparent th-text text-sm p-2.5 rounded-lg th-bg border th-border focus:outline-none focus:border-[#F6465D]/40">
                  <option value="">{t.selectProperty}</option>
                  {(properties || []).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.region === 'dubai' ? 'Dubai' : 'Turkey'})</option>
                  ))}
                </select>
              </div>
              {/* Status + Date row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] th-text-sec uppercase tracking-wider font-semibold mb-1 block">{t.caseStatus}</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full bg-transparent th-text text-sm p-2.5 rounded-lg th-bg border th-border focus:outline-none focus:border-[#F6465D]/40">
                    {CASE_STATUSES.map(s => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] th-text-sec uppercase tracking-wider font-semibold mb-1 block">{t.caseDate}</label>
                  <input type="date" value={form.dateFiled} onChange={e => setForm(f => ({ ...f, dateFiled: e.target.value }))}
                    className="w-full bg-transparent th-text text-sm p-2.5 rounded-lg th-bg border th-border focus:outline-none focus:border-[#F6465D]/40" />
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="text-[10px] th-text-sec uppercase tracking-wider font-semibold mb-1 block">{t.caseDescription}</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-transparent th-text text-sm p-2.5 rounded-lg th-bg border th-border focus:outline-none focus:border-[#F6465D]/40 resize-none"
                  placeholder={lang === 'cn' ? '案件描述...' : 'Describe the legal case...'} />
              </div>
              {/* Notes */}
              <div>
                <label className="text-[10px] th-text-sec uppercase tracking-wider font-semibold mb-1 block">{t.caseNotes}</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-transparent th-text text-sm p-2.5 rounded-lg th-bg border th-border focus:outline-none focus:border-[#F6465D]/40 resize-none"
                  placeholder={lang === 'cn' ? '备注...' : 'Additional notes...'} />
              </div>
              {/* Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleSave}
                  disabled={!form.title.trim() || !form.propertyId}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F6465D] text-white text-xs font-bold hover:bg-[#F6465D]/80 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <Save size={13} /> {t.saveCase}
                </button>
                <button onClick={closeForm}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg th-bg th-text text-xs font-medium th-hover2 transition border th-border">
                  <X size={13} /> {t.cancel}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Shop Detail / Edit / Add Modal ─────────────────────────────────────────

const ShopDetailModal = ({ shop, isNew, propertyName, currency, onSave, onDelete, onCancel, t }) => {
  const [editing, setEditing] = useState(!!isNew);
  const [form, setForm] = useState(shop ? { ...shop } : { shop: '', tenant: '', rent: 0, phone: '', contract: '', deposit: 0 });
  const [confirmDel, setConfirmDel] = useState(false);
  const [showFuture, setShowFuture] = useState(false);
  const [editingFuture, setEditingFuture] = useState(false);
  const [futureForm, setFutureForm] = useState(
    shop?.future || { tenant: '', rent: 0, phone: '', contract: '', notes: '', deposit: 0 }
  );
  const cur = currency || 'AED';
  const color = PROPERTY_COLORS[propertyName] || '#00C9A7';

  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: (key === 'rent' || key === 'deposit') ? (Number(val) || 0) : val }));
  const updateFuture = (key, val) => setFutureForm(prev => ({ ...prev, [key]: (key === 'rent' || key === 'deposit') ? (Number(val) || 0) : val }));

  const handleSave = () => {
    if (!form.shop.trim() || !form.tenant.trim()) return;
    onSave(form);
  };

  const handleSaveFuture = () => {
    if (!futureForm.tenant.trim()) return;
    const updated = { ...form, future: { ...futureForm } };
    onSave(updated);
  };

  const handleRemoveFuture = () => {
    const { future, ...rest } = form;
    onSave(rest);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="glass-card p-5 sm:p-7 max-w-lg w-full relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: `${color}20` }}>
              <Store size={20} style={{ color }} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold th-text">
                {isNew ? t.addShop : t.shopDetails}
              </h3>
              <p className="text-xs th-text-sec truncate max-w-[200px]">{propertyName}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg th-bg2 th-hover2 transition">
            <X size={16} className="th-text-sec" />
          </button>
        </div>

        {/* Delete Confirmation Inline */}
        {confirmDel ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-5">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-[#F6465D]" />
                <span className="text-sm font-semibold text-[#F6465D]">{t.confirmDeleteShop}</span>
              </div>
              <p className="text-xs th-text-sec mb-4">{t.deleteShopWarning}</p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setConfirmDel(false)}
                  className="px-3 py-1.5 rounded-lg th-bg2 th-text text-xs th-hover2 transition">{t.cancel}</button>
                <button onClick={() => onDelete(shop)}
                  className="px-3 py-1.5 rounded-lg bg-[#F6465D]/15 text-[#F6465D] text-xs hover:bg-[#F6465D]/20 transition font-medium flex items-center gap-1.5">
                  <Trash2 size={13} /> {t.confirm}
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Shop Form / Details */}
        <div className="space-y-4">
          {/* Shop Number */}
          <div>
            <label className="text-xs th-text-sec font-medium mb-1 block">{t.shopNumber}</label>
            {editing ? (
              <input value={form.shop} onChange={e => updateField('shop', e.target.value)}
                placeholder="e.g. S-01, S-1,2,3"
                className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 th-bg rounded-lg">
                <Store size={14} style={{ color }} />
                <span className="th-text text-sm font-medium">{shop.shop}</span>
              </div>
            )}
          </div>

          {/* Tenant */}
          <div>
            <label className="text-xs th-text-sec font-medium mb-1 block">{t.shopTenant}</label>
            {editing ? (
              <input value={form.tenant} onChange={e => updateField('tenant', e.target.value)}
                placeholder="Tenant / Business name"
                className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 th-bg rounded-lg">
                <Users size={14} className="th-text-sec" />
                <span className="th-text text-sm">{shop.tenant}</span>
              </div>
            )}
          </div>

          {/* Rent + Deposit + Contract row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs th-text-sec font-medium mb-1 block">{t.shopRent} ({cur})</label>
              {editing ? (
                <input type="number" value={form.rent} onChange={e => updateField('rent', e.target.value)}
                  className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
              ) : (
                <div className="px-3 py-2.5 th-bg rounded-lg">
                  <span className="th-text text-sm font-bold" style={{ color }}>{fmtCurr(shop.rent, cur)}</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs th-text-sec font-medium mb-1 block">{t.deposit} ({cur})</label>
              {editing ? (
                <input type="number" value={form.deposit ?? 0} onChange={e => updateField('deposit', Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
              ) : (
                <div className="px-3 py-2.5 th-bg rounded-lg">
                  <span className="th-text text-sm">{shop.deposit ? fmtCurr(shop.deposit, cur) : '—'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contract + Phone row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs th-text-sec font-medium mb-1 block">{t.shopContract}</label>
              {editing ? (
                <input value={form.contract} onChange={e => updateField('contract', e.target.value)}
                  placeholder="e.g. Jun 25 – May 26"
                  className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 th-bg rounded-lg">
                  <Calendar size={14} className="th-text-sec" />
                  <span className="th-text text-sm">{shop.contract || '—'}</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs th-text-sec font-medium mb-1 block">{t.shopPhone}</label>
              {editing ? (
                <input value={form.phone} onChange={e => updateField('phone', e.target.value)}
                  placeholder="Phone number"
                  className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 th-bg rounded-lg">
                  <Phone size={14} className="th-text-sec" />
                  <span className="th-text text-sm">{shop.phone || '—'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Future / Next Tenancy Section ── */}
        {!isNew && !editing && shop?.future && !showFuture && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 pt-4 border-t th-border-l">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#FCD535]/10">
                  <Calendar size={14} className="text-[#FCD535]" />
                </div>
                <span className="text-xs font-bold text-[#FCD535]">{t.futureTenancy}</span>
              </div>
              <button onClick={() => { setShowFuture(true); setEditingFuture(true); setFutureForm(shop.future); }}
                className="flex items-center gap-1 px-2 py-1 rounded-md th-bg2 text-[10px] th-text-sec th-hover2 transition">
                <Edit3 size={10} /> {t.editFuture}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 th-bg rounded-lg">
                <Users size={13} className="th-text-sec" />
                <span className="th-text text-xs font-medium">{shop.future.tenant}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="px-3 py-2 th-bg rounded-lg">
                  <span className="text-[10px] th-text-sec block mb-0.5">{t.futureRent}</span>
                  <span className="th-text text-xs font-bold" style={{ color }}>{fmtCurr(shop.future.rent, cur)}</span>
                </div>
                <div className="px-3 py-2 th-bg rounded-lg">
                  <span className="text-[10px] th-text-sec block mb-0.5">{t.futureContract}</span>
                  <span className="th-text text-xs">{shop.future.contract || '—'}</span>
                </div>
              </div>
              {shop.future.phone && (
                <div className="flex items-center gap-2 px-3 py-2 th-bg rounded-lg">
                  <Phone size={13} className="th-text-sec" />
                  <span className="th-text text-xs">{shop.future.phone}</span>
                </div>
              )}
              {shop.future.notes && (
                <div className="px-3 py-2 th-bg rounded-lg">
                  <span className="text-[10px] th-text-sec block mb-0.5">{t.futureNotes}</span>
                  <span className="th-text text-xs">{shop.future.notes}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Future Tenancy Form ── */}
        <AnimatePresence>
          {showFuture && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 pt-4 border-t th-border-l overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-[#FCD535]/10">
                  <Calendar size={14} className="text-[#FCD535]" />
                </div>
                <span className="text-xs font-bold text-[#FCD535]">{t.futureTenancy}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs th-text-sec font-medium mb-1 block">{t.futureTenant}</label>
                  <input value={futureForm.tenant} onChange={e => updateFuture('tenant', e.target.value)}
                    placeholder="Next tenant / business name"
                    className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs th-text-sec font-medium mb-1 block">{t.futureRent} ({cur})</label>
                    <input type="number" value={futureForm.rent} onChange={e => updateFuture('rent', e.target.value)}
                      className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
                  </div>
                  <div>
                    <label className="text-xs th-text-sec font-medium mb-1 block">{t.futureContract}</label>
                    <input value={futureForm.contract} onChange={e => updateFuture('contract', e.target.value)}
                      placeholder="e.g. Jan 27 – Dec 27"
                      className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="text-xs th-text-sec font-medium mb-1 block">{t.futurePhone}</label>
                  <input value={futureForm.phone} onChange={e => updateFuture('phone', e.target.value)}
                    placeholder="Phone number"
                    className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition" />
                </div>
                <div>
                  <label className="text-xs th-text-sec font-medium mb-1 block">{t.futureNotes}</label>
                  <textarea value={futureForm.notes} onChange={e => updateFuture('notes', e.target.value)}
                    rows={2} placeholder="Amendments, notes, special conditions..."
                    className="w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition resize-none" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  {shop?.future && (
                    <button onClick={handleRemoveFuture}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-[#F6465D] text-xs hover:bg-[#F6465D]/15 transition">
                      <Trash2 size={12} /> {t.removeFuture}
                    </button>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <button onClick={() => { setShowFuture(false); setEditingFuture(false); }}
                      className="px-3 py-1.5 rounded-lg th-bg2 th-text text-xs th-hover2 transition">{t.cancel}</button>
                    <button onClick={handleSaveFuture}
                      disabled={!futureForm.tenant.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FCD535]/15 text-[#FCD535] text-xs hover:bg-[#FCD535]/20 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed">
                      <Save size={12} /> {t.saveFuture}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t th-border">
          <div className="flex gap-2">
            {!isNew && !editing && onDelete && (
              <button onClick={() => setConfirmDel(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-[#F6465D] text-xs hover:bg-[#F6465D]/15 transition">
                <Trash2 size={13} /> {t.deleteShop}
              </button>
            )}
            {!isNew && !editing && (
              <button onClick={() => { setShowFuture(true); setEditingFuture(true); if (!shop?.future) setFutureForm({ tenant: '', rent: 0, phone: '', contract: '', notes: '' }); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FCD535]/10 text-[#FCD535] text-xs hover:bg-[#FCD535]/15 transition font-medium">
                <Plus size={13} /> {t.addFutureTenancy}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                {!isNew && (
                  <button onClick={() => { setEditing(false); setForm(shop ? { ...shop } : form); }}
                    className="px-3 py-2 rounded-lg th-bg2 th-text text-xs th-hover2 transition">{t.cancel}</button>
                )}
                <button onClick={handleSave}
                  disabled={!form.shop.trim() || !form.tenant.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FCD535]/15 text-[#FCD535] text-xs hover:bg-[#FCD535]/20 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed">
                  <Save size={13} /> {isNew ? t.addShop : t.saveShop}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg th-bg2 th-text text-xs th-hover2 transition">
                <Edit3 size={13} /> {t.editShop}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Confirm Delete Modal ────────────────────────────────────────────────────

const ConfirmDeleteModal = ({ property, onConfirm, onCancel, t }) => {
  if (!property) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 sm:p-8 max-w-md w-full relative z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#F6465D]/15">
            <AlertTriangle size={22} className="text-[#F6465D]" />
          </div>
          <h3 className="text-lg font-bold th-text">{t.confirmDelete} &ldquo;{property.name}&rdquo;?</h3>
        </div>
        <p className="text-sm th-text-sec mb-6">{t.deleteWarning}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-lg th-bg2 th-text text-sm th-hover2 transition">
            {t.cancel}
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[#F6465D]/15 text-[#F6465D] text-sm hover:bg-[#F6465D]/20 transition font-medium flex items-center gap-1.5">
            <Trash2 size={14} /> {t.confirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Add Property View ───────────────────────────────────────────────────────

const YEAR_OPTIONS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - 3 + i);

const AddPropertyView = ({ region: initRegion, onBack, onSave, t, lang }) => {
  const [form, setForm] = useState({
    name: '', type: 'residential', region: initRegion || 'turkey',
    tenant: '', phone: '', email: '', altContact: '',
    payment: '12 payments / year', paymentCN: '每年12次付款',
    leaseStart: '', leaseExpiry: '', deposit: 0,
    rentSchedule: [{ year: new Date().getFullYear(), perPayment: 0, numPayments: 12, annual: 0 }],
  });
  const [errors, setErrors] = useState({});
  const cur = form.region === 'dubai' ? 'AED' : 'TRY';
  const paymentLabel = (n) => lang === 'cn' ? `每年${n}次付款` : `${n} payments / year`;

  const updateField = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };
  const updateRegion = (r) => setForm(prev => ({ ...prev, region: r }));
  const updatePaymentFreq = (n) => {
    const num = Number(n);
    setForm(prev => {
      const schedule = prev.rentSchedule.map(row => ({
        ...row, numPayments: num, annual: row.perPayment * num,
      }));
      return { ...prev, payment: `${num} payments / year`, paymentCN: `每年${num}次付款`, rentSchedule: schedule };
    });
  };
  const addYear = () => {
    setForm(prev => {
      const lastYear = prev.rentSchedule.length > 0
        ? prev.rentSchedule[prev.rentSchedule.length - 1].year + 1
        : new Date().getFullYear();
      const numP = prev.rentSchedule[0]?.numPayments || 12;
      return { ...prev, rentSchedule: [...prev.rentSchedule, { year: lastYear, perPayment: 0, numPayments: numP, annual: 0 }] };
    });
  };
  const removeYear = (idx) => {
    setForm(prev => ({ ...prev, rentSchedule: prev.rentSchedule.filter((_, i) => i !== idx) }));
  };
  const updateSchedule = (idx, key, val) => {
    setForm(prev => {
      const schedule = [...prev.rentSchedule];
      schedule[idx] = { ...schedule[idx], [key]: Number(val) || 0 };
      if (key === 'perPayment' || key === 'numPayments') {
        schedule[idx].annual = schedule[idx].perPayment * schedule[idx].numPayments;
      }
      return { ...prev, rentSchedule: schedule };
    });
  };

  const handleSubmit = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.tenant.trim()) errs.tenant = true;
    if (!form.leaseStart) errs.leaseStart = true;
    if (!form.leaseExpiry) errs.leaseExpiry = true;
    if (form.rentSchedule.length === 0) errs.schedule = true;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const currentYearRent = form.rentSchedule[0]?.annual || 0;
    const leaseTotal = form.rentSchedule.reduce((sum, r) => sum + r.annual, 0);
    const newProp = {
      ...form,
      id: Date.now(),
      currency: cur,
      deposit: Number(form.deposit) || 0,
      currentYearRent,
      leaseTotal,
    };
    onSave(newProp);
  };

  const inputCls = 'w-full th-bg border th-border rounded-lg px-3 py-2.5 th-text text-sm focus:ring-1 focus:ring-[#FCD535]/30 outline-none transition';
  const selectCls = inputCls + ' appearance-auto';
  const labelCls = 'text-xs th-text-sec font-medium mb-1.5 block';
  const errBorder = 'border-red-500/60 ring-1 ring-red-500/30';

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-2">
        <button onClick={onBack} className="flex items-center gap-2 th-text-sec th-hover-t transition text-sm">
          <ArrowLeft size={18} /> {t.back}
        </button>
        <h2 className="text-lg sm:text-xl font-bold th-text flex items-center gap-2">
          <Plus size={20} className="text-[#FCD535]" /> {t.addProperty}
        </h2>
      </div>

      {/* Property Info */}
      <div className="glass-card p-4 sm:p-5 mb-4">
        <h3 className="text-sm font-bold th-text mb-3 flex items-center gap-2">
          <Building2 size={16} className="text-[#FCD535]" /> {lang === 'cn' ? '物业信息' : 'Property Info'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>{t.propertyName} *</label>
            <input value={form.name} onChange={e => updateField('name', e.target.value)}
              className={`${inputCls} ${errors.name ? errBorder : ''}`} placeholder="e.g. Anthill 1502" />
          </div>
          <div>
            <label className={labelCls}>{t.propertyType}</label>
            <select value={form.type} onChange={e => updateField('type', e.target.value)} className={selectCls}>
              <option value="residential">{t.residential}</option>
              <option value="commercial">{t.commercial}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{t.selectRegion}</label>
            <select value={form.region} onChange={e => updateRegion(e.target.value)} className={selectCls}>
              <option value="turkey">Turkey (TRY)</option>
              <option value="dubai">Dubai (AED)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenant Details */}
      <div className="glass-card p-4 sm:p-5 mb-4">
        <h3 className="text-sm font-bold th-text mb-3 flex items-center gap-2">
          <Users size={16} className="text-violet-400" /> {t.tenantDetails}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.tenant} *</label>
            <input value={form.tenant} onChange={e => updateField('tenant', e.target.value)}
              className={`${inputCls} ${errors.tenant ? errBorder : ''}`} placeholder={lang === 'cn' ? '租户全名' : 'Full name'} />
          </div>
          <div>
            <label className={labelCls}>{t.phone}</label>
            <input value={form.phone} onChange={e => updateField('phone', e.target.value)} className={inputCls} placeholder="+90 / +971" />
          </div>
          <div>
            <label className={labelCls}>{t.email}</label>
            <input value={form.email} onChange={e => updateField('email', e.target.value)} className={inputCls} type="email" placeholder="tenant@email.com" />
          </div>
          <div>
            <label className={labelCls}>{t.altContactLabel}</label>
            <input value={form.altContact} onChange={e => updateField('altContact', e.target.value)} className={inputCls} placeholder={lang === 'cn' ? '备用号码或姓名' : 'Secondary contact'} />
          </div>
        </div>
      </div>

      {/* Lease Details */}
      <div className="glass-card p-4 sm:p-5 mb-4">
        <h3 className="text-sm font-bold th-text mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-[#4DABF7]" /> {t.leaseDetails}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>{t.leaseStartLabel} *</label>
            <input type="date" value={form.leaseStart} onChange={e => updateField('leaseStart', e.target.value)}
              className={`${inputCls} ${errors.leaseStart ? errBorder : ''}`} />
          </div>
          <div>
            <label className={labelCls}>{t.leaseExpiryLabel} *</label>
            <input type="date" value={form.leaseExpiry} onChange={e => updateField('leaseExpiry', e.target.value)}
              className={`${inputCls} ${errors.leaseExpiry ? errBorder : ''}`} />
          </div>
          <div>
            <label className={labelCls}>{t.depositLabel} ({cur})</label>
            <input type="number" value={form.deposit} onChange={e => updateField('deposit', e.target.value)} className={inputCls} placeholder="0" />
          </div>
          <div>
            <label className={labelCls}>{t.paymentFrequency}</label>
            <select value={form.rentSchedule[0]?.numPayments || 12} onChange={e => updatePaymentFreq(e.target.value)} className={selectCls}>
              {PAYMENT_FREQ_OPTIONS.map(n => <option key={n} value={n}>{paymentLabel(n)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Rent Schedule */}
      <div className="glass-card p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold th-text flex items-center gap-2">
            <DollarSign size={16} className="text-[#FCD535]" /> {t.annualRentBreakdown}
          </h3>
          <button onClick={addYear}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FCD535]/15 text-[#FCD535] rounded-lg text-xs hover:bg-[#FCD535]/20 transition font-medium">
            <Plus size={12} /> {t.addYear}
          </button>
        </div>
        {errors.schedule && <p className="text-[#F6465D] text-xs mb-2">{lang === 'cn' ? '至少添加一个年份' : 'Add at least one year'}</p>}
        <div className="space-y-2.5">
          {form.rentSchedule.map((row, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1.2fr_0.8fr_1.2fr_auto] gap-2 items-end">
              <div>
                {idx === 0 && <label className={labelCls}>{t.yearLabel}</label>}
                <select value={row.year} onChange={e => updateSchedule(idx, 'year', e.target.value)} className={selectCls}>
                  {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                {idx === 0 && <label className={labelCls}>{t.perPayment} ({cur})</label>}
                <input type="number" value={row.perPayment} onChange={e => updateSchedule(idx, 'perPayment', e.target.value)}
                  className={inputCls} placeholder="0" />
              </div>
              <div>
                {idx === 0 && <label className={labelCls}>{t.numPayments}</label>}
                <select value={row.numPayments} onChange={e => updateSchedule(idx, 'numPayments', e.target.value)} className={selectCls}>
                  {PAYMENT_FREQ_OPTIONS.map(n => <option key={n} value={n}>{n}x</option>)}
                </select>
              </div>
              <div>
                {idx === 0 && <label className={labelCls}>{t.annualTotal}</label>}
                <div className="px-3 py-2.5 rounded-lg th-bg border th-border text-sm th-text font-semibold text-right">
                  {cur} {fmtNum(row.annual)}
                </div>
              </div>
              <div className={idx === 0 ? 'mt-5' : ''}>
                <button onClick={() => removeYear(idx)}
                  className="p-2 text-[#F6465D] hover:bg-[#F6465D]/15 rounded-lg transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {form.rentSchedule.length > 0 && (
          <div className="flex justify-end mt-3 pt-3 border-t th-border">
            <div className="text-sm font-bold th-text">
              {lang === 'cn' ? '合计' : 'Total'}: <span className="text-[#FCD535]">{cur} {fmtNum(form.rentSchedule.reduce((s, r) => s + r.annual, 0))}</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 mb-8">
        <button onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl th-bg2 th-text font-semibold text-sm th-hover2 transition border th-border">
          <X size={16} /> {t.cancel}
        </button>
        <button onClick={handleSubmit}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FCD535] text-[#0B0E11] font-semibold text-sm hover:bg-[#F0B90B] transition shadow-lg">
          <Save size={16} /> {t.createProperty}
        </button>
      </div>
    </motion.div>
  );
};

// ─── New Tenancy View ────────────────────────────────────────────────────────

const NewTenancyView = ({ property, onBack, onApply, t }) => {
  const cur = property.currency || (property.region === 'dubai' ? 'AED' : 'TRY');
  const [mode, setMode] = useState('new'); // 'new' = new tenant, 'renew' = lease renewal
  const lastSched = property.rentSchedule[property.rentSchedule.length - 1] || {};
  const nextYear = (lastSched.year || new Date().getFullYear()) + 1;

  const [form, setForm] = useState({
    tenant: mode === 'renew' ? property.tenant : '',
    phone: mode === 'renew' ? (property.phone || '') : '',
    email: mode === 'renew' ? (property.email || '') : '',
    altContact: mode === 'renew' ? (property.altContact || '') : '',
    leaseStart: '',
    leaseExpiry: '',
    deposit: property.deposit ?? 0,
    rentSchedule: [{ year: nextYear, perPayment: lastSched.perPayment || 0, numPayments: lastSched.numPayments || 12, annual: (lastSched.perPayment || 0) * (lastSched.numPayments || 12) }],
  });

  const switchMode = (m) => {
    setMode(m);
    if (m === 'renew') setForm(f => ({ ...f, tenant: property.tenant, phone: property.phone || '', email: property.email || '', altContact: property.altContact || '' }));
    else setForm(f => ({ ...f, tenant: '', phone: '', email: '', altContact: '' }));
  };

  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const updateSched = (idx, key, val) => {
    setForm(prev => {
      const sched = [...prev.rentSchedule];
      sched[idx] = { ...sched[idx], [key]: Number(val) || 0 };
      if (key === 'perPayment' || key === 'numPayments') sched[idx].annual = sched[idx].perPayment * sched[idx].numPayments;
      return { ...prev, rentSchedule: sched };
    });
  };
  const addYear = () => {
    const last = form.rentSchedule[form.rentSchedule.length - 1] || {};
    setForm(prev => ({ ...prev, rentSchedule: [...prev.rentSchedule, { year: (last.year || nextYear) + 1, perPayment: last.perPayment || 0, numPayments: last.numPayments || 12, annual: (last.perPayment || 0) * (last.numPayments || 12) }] }));
  };
  const removeYear = (idx) => setForm(prev => ({ ...prev, rentSchedule: prev.rentSchedule.filter((_, i) => i !== idx) }));

  const handleApply = () => {
    if (!form.tenant.trim() || !form.leaseStart || !form.leaseExpiry || form.rentSchedule.length === 0) return;
    const updated = { ...property };
    updated.tenant = form.tenant;
    updated.phone = form.phone;
    updated.email = form.email;
    updated.altContact = form.altContact;
    updated.leaseStart = form.leaseStart;
    updated.leaseExpiry = form.leaseExpiry;
    updated.deposit = Number(form.deposit) || 0;
    if (mode === 'renew') {
      updated.rentSchedule = [...property.rentSchedule, ...form.rentSchedule];
    } else {
      updated.rentSchedule = form.rentSchedule;
    }
    updated.currentYearRent = form.rentSchedule[0]?.annual || 0;
    updated.leaseTotal = updated.rentSchedule.reduce((s, r) => s + (r.annual || 0), 0);
    updated.tenancyEnded = false;
    updated.tenancyEndDate = '';
    onApply(updated);
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-lg th-bg th-text border th-border text-sm focus:outline-none focus:ring-1 focus:ring-[#FCD535]/30';
  const selectCls = inputCls + ' appearance-auto';
  const labelCls = 'text-xs th-text-sec font-medium mb-1.5 block';

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 th-text-sec th-hover-t transition text-sm">
          <ArrowLeft size={18} /> {t.back}
        </button>
        <h2 className="text-lg sm:text-xl font-bold th-text flex items-center gap-2"><UserPlus size={20} className="text-violet-400" /> {t.newTenancyTitle}</h2>
      </div>

      {/* Property Info Badge */}
      <div className="glass-card p-4 mb-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#FCD535]/10">
          {property.type === 'commercial' ? <Store size={20} className="text-[#FCD535]" /> : <Home size={20} className="text-[#FCD535]" />}
        </div>
        <div>
          <p className="font-bold th-text">{property.name}</p>
          <p className="text-xs th-text-sec"><Flag region={property.region} size={12} /> {property.region === 'dubai' ? 'Dubai' : 'Turkey'} · {cur}</p>
        </div>
        {mode === 'new' && property.tenant && (
          <div className="ml-auto text-right">
            <p className="text-[10px] th-text-sec uppercase tracking-wider">{t.previousTenant}</p>
            <p className="text-sm th-text font-medium">{property.tenant}</p>
          </div>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="glass-card p-4 mb-4">
        <p className={labelCls}>{t.tenancyType}</p>
        <div className="flex gap-2 mt-1">
          <button onClick={() => switchMode('new')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'new' ? 'bg-[#845EF7]/15 text-[#845EF7] border border-violet-500/30' : 'th-bg th-text-sec th-hover2 border th-border'
            }`}>
            <UserPlus size={15} /> {t.newTenant}
          </button>
          <button onClick={() => switchMode('renew')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'renew' ? 'bg-[#FCD535]/15 text-[#FCD535] border border-emerald-500/30' : 'th-bg th-text-sec th-hover2 border th-border'
            }`}>
            <RefreshCw size={15} /> {t.leaseRenewal}
          </button>
        </div>
      </div>

      {/* Tenant Details */}
      <div className="glass-card p-4 mb-4">
        <h3 className="text-sm font-bold th-text mb-3 flex items-center gap-2"><Users size={16} className="text-violet-400" /> {t.tenantDetails}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className={labelCls}>{t.newTenantName} *</label><input className={inputCls} value={form.tenant} onChange={e => updateField('tenant', e.target.value)} /></div>
          <div><label className={labelCls}>{t.newPhone}</label><input className={inputCls} value={form.phone} onChange={e => updateField('phone', e.target.value)} /></div>
          <div><label className={labelCls}>{t.newEmail}</label><input className={inputCls} type="email" value={form.email} onChange={e => updateField('email', e.target.value)} /></div>
          <div><label className={labelCls}>{t.newAltContact}</label><input className={inputCls} value={form.altContact} onChange={e => updateField('altContact', e.target.value)} /></div>
        </div>
      </div>

      {/* Lease Details */}
      <div className="glass-card p-4 mb-4">
        <h3 className="text-sm font-bold th-text mb-3 flex items-center gap-2"><Calendar size={16} className="text-[#4DABF7]" /> {t.leaseDetails}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div><label className={labelCls}>{t.newLeaseStart} *</label><input className={inputCls} type="date" value={form.leaseStart} onChange={e => updateField('leaseStart', e.target.value)} /></div>
          <div><label className={labelCls}>{t.newLeaseExpiry} *</label><input className={inputCls} type="date" value={form.leaseExpiry} onChange={e => updateField('leaseExpiry', e.target.value)} /></div>
          <div><label className={labelCls}>{t.newDeposit} ({cur})</label><input className={inputCls} type="number" value={form.deposit} onChange={e => updateField('deposit', e.target.value)} /></div>
        </div>
      </div>

      {/* Rent Schedule */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold th-text flex items-center gap-2"><DollarSign size={16} className="text-[#FCD535]" /> {t.renewalYears}</h3>
          <button onClick={addYear} className="flex items-center gap-1 px-2.5 py-1 bg-[#FCD535]/15 text-[#FCD535] rounded-lg text-xs hover:bg-[#FCD535]/20 transition">
            <Plus size={12} /> {t.addYear}
          </button>
        </div>
        {mode === 'renew' && property.rentSchedule.length > 0 && (
          <div className="mb-3 p-3 rounded-lg th-bg border th-border">
            <p className="text-[10px] th-text-sec uppercase tracking-wider mb-2">{t.currentDetails} — {t.annualRentBreakdown}</p>
            <div className="grid grid-cols-4 gap-2 text-[10px] th-text-sec font-medium mb-1">
              <span>{t.year}</span><span>{t.perPayment}</span><span>{t.numPayments}</span><span>{t.annualTotal}</span>
            </div>
            {property.rentSchedule.map((r, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 text-xs th-text py-0.5">
                <span>{r.year}</span><span>{cur} {fmtNum(r.perPayment)}</span><span>{r.numPayments}</span><span>{cur} {fmtNum(r.annual)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-2.5">
          {form.rentSchedule.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.2fr_0.8fr_1.2fr_auto] gap-2 items-end">
              <div>
                {i === 0 && <label className={labelCls}>{t.yearLabel}</label>}
                <select value={r.year} onChange={e => updateSched(i, 'year', e.target.value)} className={selectCls}>
                  {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                {i === 0 && <label className={labelCls}>{t.perPayment} ({cur})</label>}
                <input className={inputCls} type="number" value={r.perPayment} onChange={e => updateSched(i, 'perPayment', e.target.value)} placeholder="0" />
              </div>
              <div>
                {i === 0 && <label className={labelCls}>{t.numPayments}</label>}
                <select value={r.numPayments} onChange={e => updateSched(i, 'numPayments', e.target.value)} className={selectCls}>
                  {PAYMENT_FREQ_OPTIONS.map(n => <option key={n} value={n}>{n}x</option>)}
                </select>
              </div>
              <div>
                {i === 0 && <label className={labelCls}>{t.annualTotal}</label>}
                <div className="px-3 py-2.5 rounded-lg th-bg border th-border text-sm th-text font-semibold text-right">{cur} {fmtNum(r.annual)}</div>
              </div>
              <div className={i === 0 ? 'mt-5' : ''}>
                {form.rentSchedule.length > 1 && (
                  <button onClick={() => removeYear(i)} className="p-2 text-[#F6465D] hover:bg-[#F6465D]/15 rounded-lg transition"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl th-bg2 th-text font-semibold text-sm th-hover2 transition border th-border">
          <X size={16} /> {t.cancel}
        </button>
        <button onClick={handleApply}
          disabled={!form.tenant.trim() || !form.leaseStart || !form.leaseExpiry}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-violet-400 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg">
          <UserPlus size={16} /> {t.applyTenancy}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Export View ─────────────────────────────────────────────────────────────

const ExportView = ({ properties, onBack, t, lang }) => {
  const trProps = properties.filter(p => p.region === 'turkey');
  const dxbProps = properties.filter(p => p.region === 'dubai');
  const countUnits = (arr) => arr.reduce((s, p) => s + (p.units || 1), 0);
  const totalUnits = countUnits(properties);
  const dxbUnits = countUnits(dxbProps);
  const trUnits = countUnits(trProps);
  const [exporting, setExporting] = useState(null);

  const handleExport = async (type, data, filename) => {
    setExporting(type);
    try {
      if (type === 'single') {
        await exportSingleProperty(data, t);
      } else {
        await exportProperties(data, filename, t);
      }
    } catch (e) { console.error('Export failed', e); }
    setTimeout(() => setExporting(null), 1200);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 th-text-sec th-hover-t transition text-sm mb-6">
        <ArrowLeft size={18} /> {t.back}
      </button>
      <h2 className="text-xl sm:text-2xl font-bold th-text mb-6 flex items-center gap-2">
        <Download size={22} className="text-[#FCD535]" /> {t.exportData}
      </h2>

      {/* Export All */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="glass-card p-5 sm:p-6 mb-4 cursor-pointer group"
        onClick={() => handleExport('all', properties, 'Leomars_All_Properties')}
        whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-3 rounded-xl bg-[#FCD535]/15 shrink-0">
              <Download size={22} className="text-[#FCD535]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold th-text truncate">{t.exportAll}</h3>
              <p className="text-xs sm:text-sm th-text-sec mt-0.5 truncate">{t.exportAllDesc}</p>
              <p className="text-xs text-[#FCD535] mt-1 font-medium truncate">{totalUnits} {t.propertiesCount}</p>
            </div>
          </div>
          <div className={`p-2 rounded-lg transition ${exporting === 'all' ? 'bg-[#FCD535]/30' : 'th-bg2 group-hover:bg-[#FCD535]/15'}`}>
            {exporting === 'all'
              ? <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.6 }}><RefreshCw size={18} className="text-[#FCD535]" /></motion.div>
              : <Download size={18} className="th-text-sec group-hover:text-[#FCD535] transition" />}
          </div>
        </div>
      </motion.div>

      {/* Export by Region */}
      <h3 className="text-sm font-semibold th-text-sec mb-3 mt-6 uppercase tracking-wider">{t.exportRegion}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* Dubai */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"
          className="glass-card p-4 sm:p-5 cursor-pointer group"
          onClick={() => handleExport('dubai', dxbProps, 'Leomars_Dubai_Properties')}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="flex items-center gap-3 mb-3">
            <Flag region="dubai" size={24} />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold th-text truncate">{t.dubaiPortfolio}</h4>
              <p className="text-xs th-text-sec truncate">{dxbUnits} {t.propertiesCount}</p>
            </div>
            <div className={`p-1.5 rounded-lg transition ${exporting === 'dubai' ? 'bg-[#FCD535]/18' : 'th-bg group-hover:bg-[#FCD535]/12'}`}>
              {exporting === 'dubai'
                ? <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.6 }}><RefreshCw size={16} className="text-[#FCD535]" /></motion.div>
                : <Download size={16} className="th-text-sec group-hover:text-[#FCD535] transition" />}
            </div>
          </div>
          <div className="space-y-1">
            {dxbProps.map(p => {
              const propVacant = p.tenancyEnded === true;
              const propExpired = !propVacant && daysRemaining(p.leaseExpiry) <= 0;
              const propNearExpiry = !propVacant && !propExpired && daysRemaining(p.leaseExpiry) <= 30;
              return (
                <div key={p.id} className="flex items-center gap-2 text-xs th-text-sec">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: propVacant ? '#F97316' : propExpired ? '#F6465D' : PROPERTY_COLORS[p.name] }} />
                  <span className={`truncate ${propVacant ? 'text-[#F97316] font-bold' : propExpired ? 'text-[#F6465D]' : propNearExpiry ? 'text-[#F59E0B]' : ''}`}>{p.name} {propVacant ? `(${t.vacant})` : ''}</span>
                  {propExpired && (
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-[8px] font-extrabold uppercase tracking-wider text-[#F6465D] shrink-0">
                      EXPIRED
                    </motion.span>
                  )}
                  {propNearExpiry && (
                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center gap-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#F59E0B] shrink-0">
                      <Clock size={8} /> {t.nearExpiry}
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
        {/* Turkey */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"
          className="glass-card p-4 sm:p-5 cursor-pointer group"
          onClick={() => handleExport('turkey', trProps, 'Leomars_Turkey_Properties')}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="flex items-center gap-3 mb-3">
            <Flag region="turkey" size={24} />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold th-text truncate">{t.turkeyPortfolio}</h4>
              <p className="text-xs th-text-sec truncate">{trUnits} {t.propertiesCount}</p>
            </div>
            <div className={`p-1.5 rounded-lg transition ${exporting === 'turkey' ? 'bg-red-500/30' : 'th-bg group-hover:bg-[#F6465D]/15'}`}>
              {exporting === 'turkey'
                ? <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.6 }}><RefreshCw size={16} className="text-[#F6465D]" /></motion.div>
                : <Download size={16} className="th-text-sec group-hover:text-[#F6465D] transition" />}
            </div>
          </div>
          <div className="space-y-1">
            {trProps.map(p => {
              const propVacant = p.tenancyEnded === true;
              const propExpired = !propVacant && daysRemaining(p.leaseExpiry) <= 0;
              const propNearExpiry = !propVacant && !propExpired && daysRemaining(p.leaseExpiry) <= 30;
              return (
                <div key={p.id} className="flex items-center gap-2 text-xs th-text-sec">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: propVacant ? '#F97316' : propExpired ? '#F6465D' : PROPERTY_COLORS[p.name] }} />
                  <span className={`truncate ${propVacant ? 'text-[#F97316] font-bold' : propExpired ? 'text-[#F6465D]' : propNearExpiry ? 'text-[#F59E0B]' : ''}`}>{p.name} {propVacant ? `(${t.vacant})` : ''}</span>
                  {propExpired && (
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-[8px] font-extrabold uppercase tracking-wider text-[#F6465D] shrink-0">
                      EXPIRED
                    </motion.span>
                  )}
                  {propNearExpiry && (
                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center gap-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#F59E0B] shrink-0">
                      <Clock size={8} /> {t.nearExpiry}
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Export Individual */}
      <h3 className="text-sm font-semibold th-text-sec mb-3 uppercase tracking-wider">{t.exportProperty}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {properties.map(p => {
          const color = PROPERTY_COLORS[p.name] || getPropertyColor(p.name);
          const propVacant = p.tenancyEnded === true;
          const propExpired = !propVacant && daysRemaining(p.leaseExpiry) <= 0;
          const propNearExpiry = !propVacant && !propExpired && daysRemaining(p.leaseExpiry) <= 30;
          return (
            <motion.div key={p.id} variants={fadeInUp} initial="hidden" animate="visible"
              className="glass-card p-3 sm:p-4 cursor-pointer group relative overflow-hidden"
              onClick={() => handleExport('single', p, p.name)}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <div className="absolute top-1.5 right-1.5 z-10 flex flex-col items-end gap-0.5">
                {propVacant && (
                  <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-extrabold uppercase tracking-wider"
                    style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>
                    <Home size={9} /> {t.vacant}
                  </motion.div>
                )}
                {propExpired && (
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-extrabold uppercase tracking-wider"
                    style={{ background: 'rgba(246,70,93,0.15)', color: '#F6465D', border: '1px solid rgba(246,70,93,0.3)' }}>
                    <AlertTriangle size={9} /> EXPIRED
                  </motion.div>
                )}
                {propNearExpiry && (
                  <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-extrabold uppercase tracking-wider"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <Clock size={9} /> {t.nearExpiry}
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg shrink-0" style={{ background: propVacant ? 'rgba(249,115,22,0.15)' : propExpired ? 'rgba(246,70,93,0.15)' : `${color}20` }}>
                  {p.type === 'commercial' ? <Store size={16} style={{ color: propExpired ? '#F6465D' : color }} /> : <Home size={16} style={{ color: propExpired ? '#F6465D' : color }} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-bold truncate ${propExpired ? 'text-[#F6465D]' : 'th-text'}`}>{p.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Flag region={p.region} size={12} />
                    <span className={`text-[10px] truncate ${p.tenancyEnded ? 'text-[#F97316] font-bold uppercase' : 'th-text-sec'}`}>{p.tenancyEnded ? t.vacant : p.tenant}</span>
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg transition ${exporting === 'single' ? 'bg-[#4DABF7]/20' : 'th-bg group-hover:bg-[#4DABF7]/15'}`}>
                  <Download size={14} className="th-text-sec group-hover:text-[#4DABF7] transition" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ─── Region Summary Table ───────────────────────────────────────────────────

const RegionTable = ({ properties: props, title, flag, region, currency, rate, aedRate, t, onSelect, onAdd, onUpdateShops, legalCases = [] }) => {
  const activeRate = currency === 'AED' ? aedRate : rate;
  const totalRent = props.reduce((s, p) => s + (p.currentYearRent || 0), 0);
  const totalDeposit = props.reduce((s, p) => s + (p.deposit || 0), 0);
  const totalMonthly = Math.round(totalRent / 12);
  const [expanded, setExpanded] = useState({});
  const [selectedShop, setSelectedShop] = useState(null); // { propId, shop, index, propName } or { propId, propName, isNew }
  const toggleExpand = (id, e) => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [id]: !prev[id] })); };

  const openShop = (propId, propName, shop, idx) => setSelectedShop({ propId, propName, shop, index: idx });
  const openAddShop = (propId, propName, e) => { e.stopPropagation(); setSelectedShop({ propId, propName, isNew: true }); };
  const closeShop = () => setSelectedShop(null);

  const handleShopSave = (updatedShop) => {
    if (!onUpdateShops || !selectedShop) return;
    const prop = props.find(p => p.id === selectedShop.propId);
    if (!prop) return;
    let newShops;
    if (selectedShop.isNew) {
      newShops = [...(prop.shops || []), updatedShop];
    } else {
      newShops = prop.shops.map((s, i) => i === selectedShop.index ? updatedShop : s);
    }
    onUpdateShops(selectedShop.propId, newShops);
    closeShop();
  };

  const handleShopDelete = () => {
    if (!onUpdateShops || !selectedShop || selectedShop.isNew) return;
    const prop = props.find(p => p.id === selectedShop.propId);
    if (!prop) return;
    const newShops = prop.shops.filter((_, i) => i !== selectedShop.index);
    onUpdateShops(selectedShop.propId, newShops);
    closeShop();
  };

  return (
    <div className="glass-card p-3.5 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <h2 className="text-sm sm:text-lg font-bold th-text flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Flag region={region} size={20} />
          <FileText size={16} className="text-[#FCD535] shrink-0 sm:w-[18px] sm:h-[18px]" /> <span className="truncate">{title}</span>
        </h2>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onAdd && (
            <button onClick={onAdd}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#FCD535]/15 text-[#FCD535] rounded-lg text-[9px] sm:text-xs hover:bg-[#FCD535]/20 transition">
              <Plus size={12} className="sm:w-[14px] sm:h-[14px]" /> {t.addProperty}
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto sm:-mx-2 sm:px-2">
        <table className="w-full text-[9px] sm:text-xs md:text-sm">
          <thead>
            <tr className="border-b th-border">
              <th className="text-left th-text-sec font-medium py-2 px-1 sm:px-2">{t.property}</th>
              <th className="text-left th-text-sec font-medium py-2 px-1 sm:px-2 hidden md:table-cell">{t.tenant}</th>
              <th className="text-right th-text-sec font-medium py-2 px-1 sm:px-2">{t.currentYearRent}</th>
              <th className="text-right th-text-sec font-medium py-2 px-1 sm:px-2">{t.deposit}</th>
              <th className="text-right th-text-sec font-medium py-2 px-1 sm:px-2">{t.monthlyRent}</th>
            </tr>
          </thead>
          <tbody>
            {props.map(p => {
              const hasShops = p.shops && p.shops.length > 0;
              const isOpen = expanded[p.id];
              const pDays = daysRemaining(p.leaseExpiry);
              const pEnded = p.tenancyEnded === true;
              const pExpired = !pEnded && pDays <= 0;  // Vacant suppresses Expired
              const pNearExpiry = !pEnded && !pExpired && pDays <= 30;  // Vacant suppresses Near Expiry
              const pLegal = legalCases.some(c => c.propertyId === p.id && c.status !== 'closed');
              return (
                <React.Fragment key={p.id}>
                  <tr className="border-b th-border-l th-hover-l transition cursor-pointer"
                    onClick={() => onSelect(p)}>
                    <td className="py-2 px-1 sm:px-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {hasShops ? (
                          <button onClick={(e) => toggleExpand(p.id, e)}
                            className="p-0.5 rounded hover:bg-[#FCD535]/12 transition shrink-0"
                            title={isOpen ? 'Collapse' : 'Expand shops'}>
                            <ChevronDown size={14} className={`text-[#FCD535] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                        ) : (
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PROPERTY_COLORS[p.name] }} />
                        )}
                        <span className="th-text font-medium truncate max-w-[70px] sm:max-w-none">{p.name}</span>
                        {hasShops && <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full bg-[#FCD535]/10 text-[#FCD535] font-semibold whitespace-nowrap">{p.units} units</span>}
                        {pExpired && <span className="text-[7px] sm:text-[8px] px-1 py-0.5 rounded font-bold uppercase text-[#F6465D] bg-[#F6465D]/15 whitespace-nowrap animate-pulse">Expired</span>}
                        {pNearExpiry && <span className="text-[7px] sm:text-[8px] px-1 py-0.5 rounded font-bold uppercase text-[#F59E0B] bg-[#F59E0B]/15 whitespace-nowrap animate-pulse">{t.nearExpiry}</span>}
                        {pLegal && <span className="text-[7px] sm:text-[8px] px-1 py-0.5 rounded font-bold uppercase text-[#0891B2] bg-[#0891B2]/15 whitespace-nowrap animate-pulse">{t.legalCase}</span>}
                        {pEnded && <span className="text-[7px] sm:text-[8px] px-1 py-0.5 rounded font-bold uppercase text-[#F97316] bg-[#F97316]/15 whitespace-nowrap animate-pulse">{t.vacant}</span>}
                      </div>
                    </td>
                    <td className={`py-2 px-1 sm:px-2 hidden md:table-cell truncate max-w-[140px] ${pEnded ? 'text-[#F97316] font-bold uppercase text-[10px]' : 'th-text-sec'}`}>{pEnded ? t.vacant : p.tenant}</td>
                    <td className="py-2 px-1 sm:px-2 text-right">
                      <span className="inline-flex flex-col items-end">
                        <span className="th-text font-medium text-[8px] sm:text-xs truncate">{fmtCurr(p.currentYearRent, currency)}</span>
                        {activeRate && <span className="text-[#0ECB81]/80 text-[7px] sm:text-[10px] truncate">{fmtUSD(p.currentYearRent, activeRate)}</span>}
                      </span>
                    </td>
                    <td className="py-2 px-1 sm:px-2 text-right">
                      <span className="inline-flex flex-col items-end">
                        <span className="th-text text-[8px] sm:text-xs truncate">{fmtCurr(p.deposit, currency)}</span>
                        {activeRate && p.deposit > 0 && <span className="text-[#0ECB81]/80 text-[7px] sm:text-[10px] truncate">{fmtUSD(p.deposit, activeRate)}</span>}
                      </span>
                    </td>
                    <td className="py-2 px-1 sm:px-2 text-right">
                      <span className="inline-flex flex-col items-end">
                        <span className="text-[#FCD535] font-bold text-[8px] sm:text-xs">{fmtCurr(Math.round(p.currentYearRent / 12), currency)}</span>
                        {activeRate && <span className="text-[#0ECB81]/80 text-[7px] sm:text-[10px]">{fmtUSD(Math.round(p.currentYearRent / 12), activeRate)}</span>}
                      </span>
                    </td>
                  </tr>
                  {/* ── Expandable Shop Sub-rows ── */}
                  {hasShops && isOpen && (
                    <>
                      <tr className="border-b th-border-l" style={{ background: 'rgba(252,213,53,0.04)' }}>
                        <td className="py-1.5 px-1 sm:px-2 pl-6 sm:pl-8 text-[9px] sm:text-[10px] text-[#0ECB81]/80 font-semibold">Shop #</td>
                        <td className="py-1.5 px-1 sm:px-2 text-[9px] sm:text-[10px] text-[#0ECB81]/80 font-semibold hidden md:table-cell">Tenant</td>
                        <td className="py-1.5 px-1 sm:px-2 text-right text-[9px] sm:text-[10px] text-[#0ECB81]/80 font-semibold">Rent / Year</td>
                        <td className="py-1.5 px-1 sm:px-2 text-right text-[9px] sm:text-[10px] text-[#0ECB81]/80 font-semibold hidden sm:table-cell">Phone</td>
                        <td className="py-1.5 px-1 sm:px-2 text-right text-[9px] sm:text-[10px] text-[#0ECB81]/80 font-semibold">{t.deposit}</td>
                      </tr>
                      {p.shops.map((shop, si) => (
                        <tr key={si}
                          onClick={(e) => { e.stopPropagation(); openShop(p.id, p.name, shop, si); }}
                          className="border-b th-border-l transition hover:bg-[#FCD535]/8 cursor-pointer group/shoprow"
                          style={{ background: si % 2 === 0 ? 'rgba(252,213,53,0.03)' : 'transparent' }}>
                          <td className="py-1.5 px-1 sm:px-2 pl-6 sm:pl-8">
                            <div className="flex items-center gap-1.5">
                              <Store size={10} className="text-[#FCD535]/60 shrink-0 group-hover/shoprow:text-[#FCD535] transition" />
                              <span className="text-[9px] sm:text-[10px] th-text truncate group-hover/shoprow:text-[#FCD535] transition">{shop.shop}</span>
                            </div>
                          </td>
                          <td className="py-1.5 px-1 sm:px-2 text-[9px] sm:text-[10px] th-text-sec hidden md:table-cell truncate max-w-[130px]">{shop.tenant}</td>
                          <td className="py-1.5 px-1 sm:px-2 text-right">
                            <span className="text-[8px] sm:text-[10px] th-text font-medium">{fmtCurr(shop.rent, currency)}</span>
                          </td>
                          <td className="py-1.5 px-1 sm:px-2 text-right text-[8px] sm:text-[10px] th-text-sec hidden sm:table-cell">{shop.phone || '—'}</td>
                          <td className="py-1.5 px-1 sm:px-2 text-right text-[8px] sm:text-[10px] th-text-sec flex items-center justify-end gap-1">
                            <span>{shop.deposit ? fmtCurr(shop.deposit, currency) : '—'}</span>
                            <ChevronRight size={10} className="opacity-0 group-hover/shoprow:opacity-50 transition shrink-0" />
                          </td>
                        </tr>
                      ))}
                      {/* Add Shop row */}
                      {onUpdateShops && (
                        <tr className="border-b th-border-l" style={{ background: 'rgba(252,213,53,0.03)' }}>
                          <td colSpan="5" className="py-1.5 px-1 sm:px-2 pl-6 sm:pl-8">
                            <button onClick={(e) => openAddShop(p.id, p.name, e)}
                              className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#FCD535] hover:text-emerald-300 transition font-medium">
                              <Plus size={11} /> {t.addShop}
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 th-border-s">
              <td className="py-2.5 px-1 sm:px-2 text-[#FCD535] font-bold text-[10px] sm:text-xs">{t.totalPortfolio}</td>
              <td className="py-2.5 px-1 sm:px-2 hidden md:table-cell"></td>
              <td className="py-2.5 px-1 sm:px-2 text-right">
                <span className="inline-flex flex-col items-end">
                  <span className="text-[#FCD535] font-bold text-[8px] sm:text-xs">{fmtCurr(totalRent, currency)}</span>
                  {activeRate && <span className="text-[#0ECB81]/80 text-[7px] sm:text-[10px]">{fmtUSD(totalRent, activeRate)}</span>}
                </span>
              </td>
              <td className="py-2.5 px-1 sm:px-2 text-right">
                <span className="inline-flex flex-col items-end">
                  <span className="text-[#FCD535] font-bold text-[8px] sm:text-xs">{fmtCurr(totalDeposit, currency)}</span>
                  {activeRate && totalDeposit > 0 && <span className="text-[#0ECB81]/80 text-[7px] sm:text-[10px]">{fmtUSD(totalDeposit, activeRate)}</span>}
                </span>
              </td>
              <td className="py-2.5 px-1 sm:px-2 text-right">
                <span className="inline-flex flex-col items-end">
                  <span className="text-[#FCD535] font-bold text-[8px] sm:text-xs">{fmtCurr(totalMonthly, currency)}</span>
                  {activeRate && <span className="text-[#0ECB81]/80 text-[7px] sm:text-[10px]">{fmtUSD(totalMonthly, activeRate)}</span>}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Shop Detail Modal for RegionTable */}
      <AnimatePresence>
        {selectedShop && (
          <ShopDetailModal
            shop={selectedShop.isNew ? null : selectedShop.shop}
            isNew={!!selectedShop.isNew}
            propertyName={selectedShop.propName}
            currency={currency}
            onSave={handleShopSave}
            onDelete={handleShopDelete}
            onCancel={closeShop}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function App() {
  // ─── AUTH & FIRESTORE ─────────────────────────────────────────────────────
  const { user, role, userName, loading: authLoading, logout, isAdmin, isViewer } = useAuth();

  // Firestore sync — replaces localStorage for shared data
  const {
    properties: firestoreProperties,
    deletedIds: firestoreDeletedIds,
    legalCases: firestoreLegalCases,
    backups: firestoreBackups,
    dataLoaded,
    saveProperties: savePropertiesToFirestore,
    saveLegalCases: saveLegalCasesToFirestore,
    saveBackup: saveBackupToFirestore,
  } = useFirestoreSync(user);

  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('leomars_splash_done'));
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState(() => { const saved = localStorage.getItem('leomars_theme'); return (saved === 'dark' || saved === 'executive') ? saved : 'dark'; });

  // Properties & legal cases — synced from Firestore
  const [properties, setProperties] = useState([]);
  const [legalCases, setLegalCases] = useState([]);

  // Sync Firestore data into local state
  useEffect(() => {
    if (firestoreProperties !== null) setProperties(firestoreProperties);
  }, [firestoreProperties]);

  useEffect(() => {
    if (firestoreLegalCases !== null) setLegalCases(firestoreLegalCases);
  }, [firestoreLegalCases]);

  // Seed Firestore with default data if empty (first-time migration)
  useEffect(() => {
    if (!dataLoaded || !user) return;
    if (firestoreProperties === null) {
      const localData = (() => { try { return JSON.parse(localStorage.getItem('leomars_properties')); } catch { return null; } })();
      savePropertiesToFirestore(localData || DEFAULT_PROPERTIES, []);
    }
    if (firestoreLegalCases === null) {
      const localCases = (() => { try { return JSON.parse(localStorage.getItem('leomars_legal_cases')); } catch { return null; } })();
      saveLegalCasesToFirestore(localCases || [{
        id: 'case_anthill2201_1',
        title: 'Eviction Case — Anthill 2201',
        propertyId: 4,
        status: 'open',
        dateFiled: '2026-06-01',
        description: 'Eviction case to be opened in June 2026.',
        notes: 'Lawyer: Arslan Tenha (Tenha Law Firm)',
      }]);
    }
  }, [dataLoaded, user, firestoreProperties, firestoreLegalCases]);

  const saveLegalCases = useCallback((cases) => {
    setLegalCases(cases);
    saveLegalCasesToFirestore(cases);
  }, [saveLegalCasesToFirestore]);
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredSidebar, setHoveredSidebar] = useState(null);
  const previousViewRef = useRef('dashboard');
  const isFirstLoad = useRef(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [addRegion, setAddRegion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedSchedule, setExpandedSchedule] = useState({});
  const [uiScale, setUiScale] = useState(() => {
    const stored = localStorage.getItem('leomars_ui_scale');
    if (stored) return stored;
    // Default: medium on mobile, large on desktop
    return window.innerWidth >= 1024 ? 'lg' : 'md';
  });
  const { rate, aedRate, cnyRate, loading: rateLoading, lastUpdated, source: rateSource, refresh: refreshRate } = useExchangeRate();

  const t = T[lang];
  const dk = theme !== 'light';
  const THEMES = ['dark', 'executive'];
  const THEME_LABELS = { dark: { en: 'Midnight', cn: '午夜' }, executive: { en: 'Executive', cn: '行政' } };
  const cycleTheme = () => setTheme(t => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]);

  const UI_SCALES = ['sm', 'md', 'lg'];
  const UI_SCALE_LABELS = { sm: { en: 'Small', cn: '小' }, md: { en: 'Medium', cn: '中' }, lg: { en: 'Large', cn: '大' } };
  const UI_SCALE_VALUES = { sm: 0.85, md: 1, lg: 1.15 };
  const cycleScale = () => {
    setUiScale(s => {
      const next = UI_SCALES[(UI_SCALES.indexOf(s) + 1) % UI_SCALES.length];
      localStorage.setItem('leomars_ui_scale', next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('leomars_theme', theme);
  }, [theme]);

  // (localStorage auto-save removed — Firestore handles persistence)

  // Clear first-load flag after entrance animations complete
  useEffect(() => {
    if (!showSplash && isFirstLoad.current) {
      const timer = setTimeout(() => { isFirstLoad.current = false; }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // ── Derived data ──
  const trProps = properties.filter(p => p.region === 'turkey');
  const dxbProps = properties.filter(p => p.region === 'dubai');

  const trTotalRent = trProps.reduce((s, p) => s + (p.currentYearRent || 0), 0);
  const dxbTotalRent = dxbProps.reduce((s, p) => s + (p.currentYearRent || 0), 0);

  const countUnits = (arr) => arr.reduce((s, p) => s + (p.units || 1), 0);
  const totalUnits = countUnits(properties);
  const dxbUnits = countUnits(dxbProps);
  const trUnits = countUnits(trProps);

  const portfolioUSD = (rate ? trTotalRent / rate : 0) + (aedRate ? dxbTotalRent / aedRate : 0);

  const trChartData = getChartData(trProps);
  const dxbChartData = getChartData(dxbProps);

  const handleSaveProperty = (updated) => {
    saveBackupToFirestore(properties, `Before editing ${updated.name}`);
    const newProps = properties.map(p => p.id === updated.id ? updated : p);
    setProperties(newProps);
    savePropertiesToFirestore(newProps);
    setSelectedProperty(updated);
  };

  const handleRestore = (data) => { setProperties(data); savePropertiesToFirestore(data); setView('dashboard'); };

  const handleAddProperty = (newProp) => {
    saveBackupToFirestore(properties, `Before adding ${newProp.name}`);
    if (!PROPERTY_COLORS[newProp.name]) {
      PROPERTY_COLORS[newProp.name] = getPropertyColor(newProp.name);
    }
    const newProps = [...properties, newProp];
    setProperties(newProps);
    savePropertiesToFirestore(newProps);
    setView('dashboard');
    setAddRegion(null);
  };

  const [deletePermissionDenied, setDeletePermissionDenied] = useState(false);

  const handleDeleteRequest = (property) => {
    if (isAdmin) {
      setDeleteTarget(property);
    } else {
      // Accountants see a "request permission" message
      setDeletePermissionDenied(true);
      setTimeout(() => setDeletePermissionDenied(false), 3000);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget || !isAdmin) return;
    saveBackupToFirestore(properties, `Before deleting ${deleteTarget.name}`);
    const isDefault = DEFAULT_PROPERTIES.some(dp => dp.id === deleteTarget.id);
    const newDeletedIds = isDefault && !firestoreDeletedIds.includes(deleteTarget.id)
      ? [...firestoreDeletedIds, deleteTarget.id]
      : firestoreDeletedIds;
    const newProps = properties.filter(p => p.id !== deleteTarget.id);
    setProperties(newProps);
    savePropertiesToFirestore(newProps, newDeletedIds);
    setDeleteTarget(null);
    setSelectedProperty(null);
    setView('dashboard');
  };

  const handleDeleteCancel = () => { setDeleteTarget(null); };

  const handleNewTenancy = (property) => { setSelectedProperty(property); setView('newTenancy'); };

  const handleEndTenancy = (property) => {
    if (!window.confirm(t.endTenancyConfirm)) return;
    saveBackupToFirestore(properties, `Before ending tenancy for ${property.name}`);
    const updated = {
      ...property,
      tenancyEnded: true,
      tenancyEndDate: new Date().toISOString().split('T')[0],
    };
    const newProps = properties.map(p => p.id === updated.id ? updated : p);
    setProperties(newProps);
    savePropertiesToFirestore(newProps);
    if (selectedProperty?.id === property.id) setSelectedProperty(updated);
  };

  const handleApplyTenancy = (updated) => {
    saveBackupToFirestore(properties, `Before new tenancy on ${updated.name}`);
    const newProps = properties.map(p => p.id === updated.id ? updated : p);
    setProperties(newProps);
    savePropertiesToFirestore(newProps);
    setSelectedProperty(updated);
    setView('detail');
  };

  const handleUpdateShops = useCallback((propertyId, newShops) => {
    saveBackupToFirestore(properties, `Before shop edit on property #${propertyId}`);
    const updated = properties.map(p => {
      if (p.id !== propertyId) return p;
      const totalShopRent = newShops.reduce((s, sh) => s + (sh.rent || 0), 0);
      return {
        ...p,
        shops: newShops,
        units: newShops.length > 0 ? newShops.reduce((sum, sh) => {
          const nums = sh.shop.replace(/^S-/i, '').split(',').filter(Boolean);
          return sum + Math.max(nums.length, 1);
        }, 0) : (p.units || 1),
        currentYearRent: totalShopRent > 0 ? totalShopRent : p.currentYearRent,
      };
    });
    setProperties(updated);
    savePropertiesToFirestore(updated);
    const refreshed = updated.find(p => p.id === propertyId);
    if (refreshed && selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(refreshed);
    }
  }, [properties, selectedProperty, savePropertiesToFirestore, saveBackupToFirestore]);

  const selectProp = (p) => { previousViewRef.current = view; setSelectedProperty(p); setView('detail'); };

  // ─── AUTH GATE (rendered in JSX, not early return, to preserve hooks order) ───
  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#0B0E11', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <img src="/logo.png" alt="Leomars" style={{ width: '64px', height: '64px', borderRadius: '16px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ color: '#848E9C', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading Portfolio...</div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
  if (!user) return <LoginScreen />;

  return (
    <>
    {/* ─── SPLASH SCREEN ─── */}
    <AnimatePresence>
      {showSplash && (
        <SplashScreen onFinish={() => { setShowSplash(false); sessionStorage.setItem('leomars_splash_done', '1'); }} />
      )}
    </AnimatePresence>

    <div className="min-h-screen px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto overflow-x-hidden w-full box-border origin-top"
      style={{ zoom: UI_SCALE_VALUES[uiScale] }}>
      <AnimatePresence mode="wait">
        {view === 'detail' && selectedProperty ? (
          <PropertyDetailView
            key="detail"
            property={selectedProperty}
            onBack={() => { setView(previousViewRef.current || 'dashboard'); setSelectedProperty(null); }}
            onSave={handleSaveProperty}
            onDelete={handleDeleteRequest}
            onNewTenancy={handleNewTenancy}
            onEndTenancy={handleEndTenancy}
            onUpdateShops={handleUpdateShops}
            t={t} lang={lang} rate={rate} aedRate={aedRate} legalCases={legalCases}
            onNavigateToLawyer={() => { setSelectedProperty(null); setView('lawyer'); }}
          />
        ) : view === 'newTenancy' && selectedProperty ? (
          <NewTenancyView
            key="newTenancy"
            property={selectedProperty}
            onBack={() => { setView('detail'); }}
            onApply={handleApplyTenancy}
            t={t}
          />
        ) : view === 'addProperty' ? (
          <AddPropertyView
            key="addProperty"
            region={addRegion}
            onBack={() => { setView(previousViewRef.current || 'dashboard'); setAddRegion(null); }}
            onSave={handleAddProperty}
            t={t} lang={lang}
          />
        ) : view === 'export' ? (
          <ExportView key="export" properties={properties} onBack={() => setView('dashboard')} t={t} lang={lang} />
        ) : view === 'history' ? (
          <BackupHistoryView key="history" onBack={() => setView('dashboard')} onRestore={handleRestore} t={t} />
        ) : view === 'lawyer' ? (
          <LawyerContactView key="lawyer" onBack={() => setView('dashboard')} t={t} lang={lang}
            properties={properties} legalCases={legalCases} onSaveCases={saveLegalCases} />
        ) : view === 'changePassword' ? (
          <ChangePasswordView key="changePassword" onBack={() => setView('dashboard')} t={t} lang={lang}
            userEmail={user?.email || ''} />
        ) : view === 'dubai' ? (
          <motion.div key="dubai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setView('dashboard')} className="p-2 rounded-xl th-bg2 th-hover2 transition">
                <ArrowLeft size={18} className="th-text" />
              </button>
              <h2 className="text-lg sm:text-xl font-bold th-text flex items-center gap-2">
                <Flag region="dubai" size={22} /> {t.dubaiPortfolio}
              </h2>
            </div>
            <RegionTable properties={dxbProps} title={t.dubaiPortfolio} region="dubai" currency="AED"
              rate={rate} aedRate={aedRate} t={t} onSelect={selectProp}
              onAdd={isViewer ? null : () => { previousViewRef.current = 'dubai'; setAddRegion('dubai'); setView('addProperty'); }}
              onUpdateShops={handleUpdateShops} legalCases={legalCases} />
          </motion.div>
        ) : view === 'turkey' ? (
          <motion.div key="turkey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setView('dashboard')} className="p-2 rounded-xl th-bg2 th-hover2 transition">
                <ArrowLeft size={18} className="th-text" />
              </button>
              <h2 className="text-lg sm:text-xl font-bold th-text flex items-center gap-2">
                <Flag region="turkey" size={22} /> {t.turkeyPortfolio}
              </h2>
            </div>
            <RegionTable properties={trProps} title={t.turkeyPortfolio} region="turkey" currency="TRY"
              rate={rate} aedRate={aedRate} t={t} onSelect={selectProp}
              onAdd={isViewer ? null : () => { previousViewRef.current = 'turkey'; setAddRegion('turkey'); setView('addProperty'); }}
              onUpdateShops={handleUpdateShops} legalCases={legalCases} />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: isFirstLoad.current ? 0.6 : 0.3 }}>

            {/* ─── HEADER — App-style with hamburger menu ─────── */}
            <motion.header initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: isFirstLoad.current ? 0.1 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Hamburger menu button */}
                  <button onClick={() => setSidebarOpen(true)}
                    className="p-1 text-[#FCD535] hover:text-[#F0B90B] transition shrink-0">
                    <Menu size={24} strokeWidth={2.8} className="sm:w-7 sm:h-7" />
                  </button>
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#FCD535]/25 via-[#F0B90B]/10 to-transparent blur-md" />
                    <img src="/logo.png" alt="Leomars" className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-2xl object-cover ring-1 ring-[#FCD535]/15" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight gradient-text leading-tight truncate">{lang === 'cn' ? `你好, ${userName}` : `Hello, ${userName}`}</h1>
                    <p className="text-[7px] sm:text-xs th-text-sec font-medium tracking-wider sm:tracking-widest uppercase mt-0.5 leading-tight truncate">{t.subtitle} {role && <span className="opacity-60">({role})</span>}</p>
                  </div>
                </div>
                {/* Utility buttons */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <button onClick={() => setLang(l => l === 'en' ? 'cn' : 'en')}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl th-bg2 th-text th-hover2 transition" title={t.switchLang}>
                    <Globe size={13} className="sm:w-4 sm:h-4" />
                    <span className="text-[9px] sm:text-xs font-semibold">{lang === 'en' ? 'EN' : '中文'}</span>
                  </button>
                  <button onClick={cycleTheme}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl th-bg2 th-text th-hover2 transition" title={THEME_LABELS[theme][lang]}>
                    <Palette size={13} className="sm:w-4 sm:h-4" />
                    <span className="text-[9px] sm:text-xs font-semibold">{THEME_LABELS[theme][lang]}</span>
                  </button>
                  <button onClick={cycleScale}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl th-bg2 th-text th-hover2 transition" title={UI_SCALE_LABELS[uiScale][lang]}>
                    <ZoomIn size={13} className="sm:w-4 sm:h-4" />
                    <span className="text-[9px] sm:text-xs font-semibold">{UI_SCALE_LABELS[uiScale][lang]}</span>
                  </button>
                  <button onClick={logout}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#e63946]/15 text-[#e63946] hover:bg-[#e63946]/25 transition" title="Logout">
                    <LogOut size={13} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </motion.header>

            {/* ─── SIDEBAR DRAWER ─────────────────────────────── */}
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                    style={{ zoom: 1 / UI_SCALE_VALUES[uiScale] }}
                  />
                  <motion.aside
                    initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className="fixed left-0 top-0 h-full w-72 z-50 glass-card rounded-none rounded-r-2xl border-r border-[#FCD535]/10 flex flex-col overflow-y-auto"
                    style={{ zoom: 1 / UI_SCALE_VALUES[uiScale] }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between p-5 pb-4 border-b th-border">
                      <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Leomars" className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#FCD535]/15" />
                        <div>
                          <h2 className="text-sm font-bold gradient-text">Leomars</h2>
                          <p className="text-[9px] th-text-sec uppercase tracking-wider">Portfolio</p>
                        </div>
                      </div>
                      <button onClick={() => setSidebarOpen(false)}
                        className="p-1.5 rounded-lg th-bg2 th-hover2 transition">
                        <X size={16} className="th-text-sec" />
                      </button>
                    </div>
                    {/* Menu items */}
                    <div className="flex-1 p-4 space-y-2.5">
                      {[
                        { key: 'dashboard', icon: BarChart3, label: t.dashboard, color: '#FCD535' },
                        { key: 'dubai', icon: Building2, label: t.menuDubai, color: '#4DABF7' },
                        { key: 'turkey', icon: Building2, label: t.menuTurkey, color: '#F6465D' },
                        { key: 'export', icon: Download, label: t.exportData, color: '#FCD535' },
                        { key: 'history', icon: History, label: t.history, color: '#845EF7' },
                        { key: 'lawyer', icon: Scale, label: t.lawyer, color: '#F783AC' },
                        { key: 'changePassword', icon: ShieldAlert, label: t.changePassword, color: '#F97316' },
                      ].map(item => {
                        const isActive = view === item.key;
                        const isHovered = hoveredSidebar === item.key;
                        const highlight = isActive || isHovered;
                        return (
                          <button key={item.key}
                            onClick={() => { setView(item.key); setSidebarOpen(false); }}
                            onMouseEnter={() => setHoveredSidebar(item.key)}
                            onMouseLeave={() => setHoveredSidebar(null)}
                            onTouchStart={() => setHoveredSidebar(item.key)}
                            onTouchEnd={() => setTimeout(() => setHoveredSidebar(null), 300)}
                            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-semibold transition-all"
                            style={{
                              background: highlight ? `${item.color}18` : 'transparent',
                              color: highlight ? item.color : undefined,
                              border: highlight ? `1px solid ${item.color}30` : '1px solid transparent',
                            }}>
                            <div className="p-2.5 rounded-lg" style={{ background: `${item.color}15` }}>
                              <item.icon size={18} style={{ color: item.color }} />
                            </div>
                            <span className={`truncate ${highlight ? '' : 'th-text-sec'}`}>{item.label}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 rounded-full" style={{ background: item.color }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {/* Sidebar footer */}
                    <div className="p-4 pt-3 border-t th-border">
                      <p className="text-[9px] th-text-sec text-center truncate px-2">
                        Designed by Syed at Queen's Business School
                      </p>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* ─── NOTIFICATIONS ALERTS TICKER ─────────────────── */}
            {(() => {
              const allAlerts = [];
              // Lease expiry alerts
              [...properties]
                .map(p => {
                  let _days = daysRemaining(p.leaseExpiry);
                  const expiredShops = (p.shops || []).filter(s => {
                    if (!s.contract) return false;
                    const parts = s.contract.split('–').map(x => x.trim());
                    if (parts.length !== 2) return false;
                    const endStr = parts[1];
                    const m = endStr.match(/^([A-Za-z]+)\s+(\d+)$/);
                    if (!m) return false;
                    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
                    const mon = months[m[1]];
                    const yr = 2000 + parseInt(m[2]);
                    if (mon === undefined) return false;
                    const endDate = new Date(yr, mon + 1, 0);
                    return endDate < new Date();
                  });
                  return { ...p, _days, _expiredShops: expiredShops };
                })
                .filter(p => p._days < 180 && !p.tenancyEnded)  // Skip vacant properties — they show in vacant alerts instead
                .sort((a, b) => a._days - b._days)
                .forEach(p => {
                  const isExpired = p._days <= 0;
                  const isCritical = p._days < 90;
                  allAlerts.push(
                    <span key={`lease-${p.id}`} className="inline-flex items-center gap-1.5 mx-4 sm:mx-6">
                      {isExpired ? <AlertTriangle size={11} className="text-[#F6465D] animate-pulse" /> : <Clock size={11} className={isCritical ? 'text-[#F6465D] animate-pulse' : 'text-[#FCD535] animate-pulse'} />}
                      <span className={`font-bold ${isExpired ? 'text-[#F6465D]' : isCritical ? 'text-[#F6465D]' : 'text-[#FCD535]'}`}>{p.name}</span>
                      <span className="th-text-sec">—</span>
                      <span className={`font-semibold uppercase ${isExpired ? 'text-[#F6465D]' : isCritical ? 'text-[#F6465D]' : 'text-[#FCD535]'}`}>
                        {isExpired ? (lang === 'cn' ? '已过期' : 'EXPIRED') : t.nearExpiry}
                      </span>
                      {!isExpired && <span className={`text-[8px] sm:text-[10px] ${isCritical ? 'text-[#F6465D]' : 'text-[#FCD535]'}`}>({p._days} {t.daysRemaining})</span>}
                      <span className="th-text-sec">({p.leaseExpiry})</span>
                    </span>
                  );
                });
              // Legal case alerts
              properties.filter(p => legalCases.some(c => c.propertyId === p.id && c.status !== 'closed')).forEach(p => {
                allAlerts.push(
                  <span key={`legal-${p.id}`} className="inline-flex items-center gap-1.5 mx-4 sm:mx-6">
                    <Gavel size={11} className="text-[#0891B2] animate-pulse" />
                    <span className="font-bold text-[#0891B2]">{p.name}</span>
                    <span className="th-text-sec">—</span>
                    <span className="font-semibold text-[#0891B2] uppercase">{t.legalCase}</span>
                  </span>
                );
              });
              // Vacant property alerts
              properties.filter(p => p.tenancyEnded === true).forEach(p => {
                allAlerts.push(
                  <span key={`ended-${p.id}`} className="inline-flex items-center gap-1.5 mx-4 sm:mx-6">
                    <Home size={11} className="text-[#F97316] animate-pulse" />
                    <span className="font-bold text-[#F97316]">{p.name}</span>
                    <span className="th-text-sec">—</span>
                    <span className="font-semibold text-[#F97316] uppercase">{t.vacant}</span>
                    {p.tenancyEndDate && <span className="th-text-sec">({lang === 'cn' ? '自' : 'since'} {p.tenancyEndDate})</span>}
                  </span>
                );
              });
              if (allAlerts.length === 0) return null;
              const alerts = allAlerts;
              return (
                <div className="relative overflow-hidden mb-2 sm:mb-3 rounded-lg py-1.5 sm:py-2"
                  style={{ background: 'linear-gradient(90deg, rgba(246,70,93,0.06), rgba(252,213,53,0.06), rgba(246,70,93,0.06))' }}>
                  <div className="flex items-center whitespace-nowrap text-[9px] sm:text-xs animate-ticker">
                    {alerts}{alerts}{alerts}
                  </div>
                </div>
              );
            })()}

            {/* ─── LIVE EXCHANGE RATE TICKER ──────────────────── */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible"
              className="glass-card px-0 py-1.5 sm:py-2 mb-6 sm:mb-8 flex items-center overflow-hidden relative">
              {/* Refresh button — fixed left */}
              <button onClick={refreshRate}
                className="p-1.5 sm:p-2 shrink-0 z-10 relative"
                title="Refresh exchange rates">
                <RefreshCw size={16} strokeWidth={2.8} className={`th-text-sec transition-transform ${rateLoading ? 'animate-spin text-[#FCD535]' : ''}`} />
              </button>
              {/* Scrolling ticker content */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center whitespace-nowrap text-[9px] sm:text-xs animate-ticker-fx">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="inline-flex items-center">
                      <span className="inline-flex items-center gap-1.5 mx-3 sm:mx-5">
                        <DollarSign size={11} className="text-[#FCD535]" />
                        <span className="th-text font-semibold">1 USD = <span className="text-[#FCD535]">{rate ? rate.toFixed(2) : '...'} TRY</span></span>
                      </span>
                      <span className="th-text-sec">•</span>
                      <span className="inline-flex items-center gap-1.5 mx-3 sm:mx-5">
                        <DollarSign size={11} className="text-[#4DABF7]" />
                        <span className="th-text font-semibold">1 USD = <span className="text-[#4DABF7]">{aedRate ? aedRate.toFixed(2) : '...'} AED</span></span>
                      </span>
                      <span className="th-text-sec">•</span>
                      <span className="inline-flex items-center gap-1.5 mx-3 sm:mx-5">
                        <DollarSign size={11} className="text-[#F6465D]" />
                        <span className="th-text font-semibold">1 USD = <span className="text-[#E879F9]">{cnyRate ? cnyRate.toFixed(2) : '...'} CNY</span></span>
                      </span>
                      <span className="th-text-sec">•</span>
                      <span className="inline-flex items-center gap-1.5 mx-3 sm:mx-5">
                        <Clock size={11} className="text-[#FCD535]" />
                        <span className="th-text-sec font-medium">
                          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {' · '}
                          {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        {rateSource && rateSource !== 'offline' && rateSource !== 'cached' && <span className="text-[#FCD535] font-bold">✓ LIVE</span>}
                        {rateSource === 'offline' && <span className="text-[#FCD535]">⚠ OFFLINE</span>}
                        {rateSource === 'cached' && <span className="text-[#FCD535]/60">⏱ CACHED</span>}
                      </span>
                      <span className="th-text-sec mx-3 sm:mx-5">•</span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ─── KPI DASHBOARD ─────────────────────────────── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: isFirstLoad.current ? 0.3 : 0 }}
              className="mb-6 sm:mb-10 space-y-3 sm:space-y-4">

              {/* ── Hero Card: Portfolio Value ── */}
              <motion.div variants={scaleIn}
                className="glass-card relative overflow-hidden">
                {/* Top accent gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, #F0B90B, #FCD535, #FCC419, #FCD535, #F0B90B)' }} />

                <div className="p-4 sm:p-7 md:p-8">
                  {/* Top row: label + property count */}
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #FCD53520, #F0B90B12)' }}>
                        <Wallet size={18} style={{ color: '#FCD535' }} className="sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] sm:text-xs text-[#FCD535] font-bold tracking-widest uppercase truncate">{t.portfolioUSD}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl"
                      style={{ background: dk ? 'rgba(252,213,53,0.08)' : 'rgba(252,213,53,0.12)', border: '1px solid rgba(252,213,53,0.15)' }}>
                      <Building2 size={13} style={{ color: '#FCD535' }} />
                      <span className="text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: '#FCD535' }}>
                        <CountUp end={totalUnits} duration={2} /> {t.propertiesCount}
                      </span>
                    </div>
                  </div>

                  {/* Main value */}
                  <div className="mb-4 sm:mb-6">
                    <div className="text-3xl sm:text-5xl md:text-6xl font-black th-text tracking-tight leading-none"
                      style={{ textShadow: dk ? '0 0 40px rgba(252,213,53,0.1)' : 'none' }}>
                      USD <CountUp end={Math.round(portfolioUSD)} duration={2.5} separator="," delay={0.15} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5 sm:mt-3">
                      {aedRate && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{ background: '#4DABF710', color: '#4DABF7', border: '1px solid #4DABF712' }}>
                          ≈ AED {Math.round(portfolioUSD * aedRate).toLocaleString('en-US')}
                        </span>
                      )}
                      {cnyRate && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{ background: '#E879F910', color: '#E879F9', border: '1px solid #E879F912' }}>
                          ≈ CNY {Math.round(portfolioUSD * cnyRate).toLocaleString('en-US')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Allocation bar */}
                  <div className="mb-4 sm:mb-5">
                    <div className="h-2 sm:h-2.5 rounded-full overflow-hidden flex" style={{ background: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                      <div className="h-full rounded-l-full transition-all duration-1000"
                        style={{ width: `${(dxbUnits / Math.max(dxbUnits + trUnits, 1) * 100).toFixed(0)}%`, background: 'linear-gradient(90deg, #0ECB81, #0ECB81BB)' }} />
                      <div className="h-full rounded-r-full transition-all duration-1000"
                        style={{ width: `${(trUnits / Math.max(dxbUnits + trUnits, 1) * 100).toFixed(0)}%`, background: 'linear-gradient(90deg, #F59E0BBB, #F59E0B)' }} />
                    </div>
                  </div>

                </div>
              </motion.div>

              {/* ── Two Sub-Cards: Dubai Rent & Turkey Rent ── */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Dubai Rent */}
                <motion.div variants={scaleIn}
                  className="glass-card relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(180deg, #0ECB81, #0ECB8160)' }} />
                  <div style={{ padding: '8px 8px 8px 12px' }} className="sm:!p-6 sm:!pl-9 md:!p-7 md:!pl-11">
                    <div className="flex items-center flex-wrap gap-x-1 gap-y-0.5 sm:flex-nowrap sm:justify-between mb-1 sm:mb-3.5">
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: '#0ECB8112' }}>
                          <TrendingUp size={11} style={{ color: '#0ECB81' }} className="sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-[8px] sm:text-xs font-bold text-[#0ECB81] uppercase tracking-wider whitespace-nowrap">{t.dubaiRent}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
                        <Flag region="dubai" size={12} />
                        <span className="text-[10px] sm:text-sm font-bold th-text">
                          <CountUp end={dxbUnits} duration={2} />
                        </span>
                        <span className="text-[7px] sm:text-[10px] font-semibold px-0.5 sm:px-1.5 py-0.5 rounded-md"
                          style={{ background: '#0ECB8115', color: '#0ECB81' }}>
                          {(dxbUnits / Math.max(dxbUnits + trUnits, 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-[17px] sm:text-2xl md:text-3xl font-extrabold th-text leading-tight tracking-tight">
                      AED <CountUp end={dxbTotalRent} duration={2} separator="," delay={0.45} />
                    </div>
                    {aedRate && (
                      <div className="mt-0.5 sm:mt-2">
                        <span className="text-[9px] sm:text-xs font-semibold" style={{ color: '#0ECB81' }}>
                          ≈ USD {Math.round(dxbTotalRent / aedRate).toLocaleString('en-US')}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Turkey Rent */}
                <motion.div variants={scaleIn}
                  className="glass-card relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(180deg, #F59E0B, #F59E0B60)' }} />
                  <div style={{ padding: '8px 8px 8px 12px' }} className="sm:!p-6 sm:!pl-9 md:!p-7 md:!pl-11">
                    <div className="flex items-center flex-wrap gap-x-1 gap-y-0.5 sm:flex-nowrap sm:justify-between mb-1 sm:mb-3.5">
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: '#F59E0B12' }}>
                          <TrendingUp size={11} style={{ color: '#F59E0B' }} className="sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-[8px] sm:text-xs font-bold text-[#F59E0B] uppercase tracking-wider whitespace-nowrap">{t.turkeyRent}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
                        <Flag region="turkey" size={12} />
                        <span className="text-[10px] sm:text-sm font-bold th-text">
                          <CountUp end={trUnits} duration={2} />
                        </span>
                        <span className="text-[7px] sm:text-[10px] font-semibold px-0.5 sm:px-1.5 py-0.5 rounded-md"
                          style={{ background: '#F59E0B15', color: '#F59E0B' }}>
                          {(trUnits / Math.max(dxbUnits + trUnits, 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-[17px] sm:text-2xl md:text-3xl font-extrabold th-text leading-tight tracking-tight">
                      TRY <CountUp end={trTotalRent} duration={2} separator="," delay={0.3} />
                    </div>
                    {rate && (
                      <div className="mt-0.5 sm:mt-2">
                        <span className="text-[9px] sm:text-xs font-semibold" style={{ color: '#F59E0B' }}>
                          ≈ USD {Math.round(trTotalRent / rate).toLocaleString('en-US')}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ─── DUBAI CHART ────────────────────────────────── */}
            {dxbProps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: isFirstLoad.current ? 0.6 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass-card p-3.5 sm:p-6 mb-6 sm:mb-10 overflow-hidden relative">
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #FCD535, transparent)' }} />
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <h2 className="text-sm sm:text-lg font-bold th-text flex items-center gap-2 min-w-0">
                    <Flag region="dubai" size={20} />
                    <div className="p-1.5 rounded-lg shrink-0" style={{ background: '#FCD53515' }}>
                      <BarChart3 size={16} style={{ color: '#FCD535' }} />
                    </div>
                    <span className="truncate">{t.annualRentTrendDXB}</span>
                  </h2>
                </div>
                {/* Legend — modern pill chips */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {dxbProps.map(p => {
                    const c = PROPERTY_COLORS[p.name] || getPropertyColor(p.name);
                    const propVacant = p.tenancyEnded === true;
                    const propExpired = !propVacant && daysRemaining(p.leaseExpiry) <= 0;
                    const propNearExpiry = !propVacant && !propExpired && daysRemaining(p.leaseExpiry) <= 30;
                    const propHasCase = legalCases.some(lc => lc.propertyId === p.id && lc.status !== 'closed');
                    return (
                      <span key={p.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold transition-all hover:scale-105"
                        style={{ background: propExpired ? 'rgba(246,70,93,0.12)' : propVacant ? 'rgba(249,115,22,0.12)' : propNearExpiry ? 'rgba(245,158,11,0.12)' : `${c}15`, color: propExpired ? '#F6465D' : propVacant ? '#F97316' : propNearExpiry ? '#F59E0B' : c, border: `1px solid ${propExpired ? 'rgba(246,70,93,0.3)' : propVacant ? 'rgba(249,115,22,0.3)' : propNearExpiry ? 'rgba(245,158,11,0.3)' : `${c}25`}` }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: propExpired ? '#F6465D' : propVacant ? '#F97316' : c, boxShadow: `0 0 6px ${propExpired ? 'rgba(246,70,93,0.4)' : propVacant ? 'rgba(249,115,22,0.4)' : `${c}40`}` }} />
                        <span className="truncate max-w-[100px] sm:max-w-none">{p.name}</span>
                        {propVacant && (
                          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                            className="ml-0.5 flex items-center gap-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#F97316] cursor-pointer"
                            onClick={() => selectProp(p)}>
                            <Home size={9} /> {t.vacant}
                          </motion.span>
                        )}
                        {propExpired && (
                          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                            className="ml-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#F6465D] cursor-pointer"
                            onClick={() => selectProp(p)}>
                            EXPIRED
                          </motion.span>
                        )}
                        {propNearExpiry && (
                          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                            className="ml-0.5 flex items-center gap-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#F59E0B] cursor-pointer"
                            onClick={() => selectProp(p)}>
                            <Clock size={9} /> {t.nearExpiry}
                          </motion.span>
                        )}
                        {propHasCase && (
                          <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="ml-0.5 flex items-center gap-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#0891B2] cursor-pointer"
                            onClick={() => setView('lawyer')}>
                            <Gavel size={9} /> {t.legalCase}
                          </motion.span>
                        )}
                      </span>
                    );
                  })}
                </div>
                <div className="h-[260px] sm:h-[340px] md:h-[380px] rounded-xl p-2 sm:p-3" style={{ background: dk ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dxbChartData} margin={{ top: 22, right: 10, left: 5, bottom: 5 }}
                      barCategoryGap="22%">
                      <defs>
                        {dxbProps.map(p => {
                          const c = PROPERTY_COLORS[p.name] || getPropertyColor(p.name);
                          return (
                            <linearGradient key={p.name} id={`grad-${p.name.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={c} stopOpacity={1} />
                              <stop offset="100%" stopColor={c} stopOpacity={0.6} />
                            </linearGradient>
                          );
                        })}
                        <filter id="glow-dxb">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                      </defs>
                      <CartesianGrid vertical={false} stroke={dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} />
                      <XAxis dataKey="year" axisLine={false} tickLine={false}
                        tick={{ fill: dk ? '#848E9C' : '#94A3B8', fontSize: 11, fontWeight: 600 }}
                        dy={8} />
                      <YAxis axisLine={false} tickLine={false} width={50}
                        tick={{ fill: dk ? '#848E9C' : '#94A3B8', fontSize: 10, fontWeight: 500 }}
                        tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip currency="AED" rate={rate} aedRate={aedRate} />}
                        cursor={{ fill: dk ? 'rgba(252,213,53,0.06)' : 'rgba(252,213,53,0.04)', radius: 8 }}
                        trigger="hover" wrapperStyle={{ pointerEvents: 'none' }} />
                      {dxbProps.map((p, i) => (
                        <Bar key={p.name} dataKey={p.name} stackId="a"
                          fill={`url(#grad-${p.name.replace(/\s/g,'')})`}
                          shape={StackedBarShape(dxbProps.map(pp => pp.name))}
                          animationDuration={isFirstLoad.current ? 1200 : 800}
                          animationBegin={isFirstLoad.current ? 600 + i * 120 : i * 80}
                          animationEasing="ease-out">
                          {i === dxbProps.length - 1 && (
                            <LabelList position="top"
                              content={({ x, y, width, index }) => (
                                <CagrLabel x={x} y={y} width={width} index={index}
                                  data={dxbChartData} accentColor="#FCD535" />
                              )} />
                          )}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* ─── TURKEY CHART ───────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: isFirstLoad.current ? 0.9 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card p-3.5 sm:p-6 mb-6 sm:mb-10 overflow-hidden relative">
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #F6465D, transparent)' }} />
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <h2 className="text-sm sm:text-lg font-bold th-text flex items-center gap-2 min-w-0">
                  <Flag region="turkey" size={20} />
                  <div className="p-1.5 rounded-lg shrink-0" style={{ background: '#F6465D15' }}>
                    <BarChart3 size={16} style={{ color: '#F6465D' }} />
                  </div>
                  <span className="truncate">{t.annualRentTrendTR}</span>
                </h2>
              </div>
              {/* Legend — modern pill chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                {trProps.map(p => {
                  const c = PROPERTY_COLORS[p.name] || getPropertyColor(p.name);
                  const propVacant = p.tenancyEnded === true;
                  const propExpired = !propVacant && daysRemaining(p.leaseExpiry) <= 0;
                  const propNearExpiry = !propVacant && !propExpired && daysRemaining(p.leaseExpiry) <= 30;
                  const propHasCase = legalCases.some(lc => lc.propertyId === p.id && lc.status !== 'closed');
                  return (
                    <span key={p.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: propExpired ? 'rgba(246,70,93,0.12)' : propVacant ? 'rgba(249,115,22,0.12)' : propNearExpiry ? 'rgba(245,158,11,0.12)' : `${c}15`, color: propExpired ? '#F6465D' : propVacant ? '#F97316' : propNearExpiry ? '#F59E0B' : c, border: `1px solid ${propExpired ? 'rgba(246,70,93,0.3)' : propVacant ? 'rgba(249,115,22,0.3)' : propNearExpiry ? 'rgba(245,158,11,0.3)' : `${c}25`}` }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: propExpired ? '#F6465D' : propVacant ? '#F97316' : c, boxShadow: `0 0 6px ${propExpired ? 'rgba(246,70,93,0.4)' : propVacant ? 'rgba(249,115,22,0.4)' : `${c}40`}` }} />
                      {p.name}
                      {propVacant && (
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                          className="ml-0.5 flex items-center gap-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#F97316] cursor-pointer"
                          onClick={() => selectProp(p)}>
                          <Home size={9} /> {t.vacant}
                        </motion.span>
                      )}
                      {propExpired && (
                        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="ml-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#F6465D] cursor-pointer"
                          onClick={() => selectProp(p)}>
                          EXPIRED
                        </motion.span>
                      )}
                      {propNearExpiry && (
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                          className="ml-0.5 flex items-center gap-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#F59E0B] cursor-pointer"
                          onClick={() => selectProp(p)}>
                          <Clock size={9} /> {t.nearExpiry}
                        </motion.span>
                      )}
                      {propHasCase && (
                        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="ml-0.5 flex items-center gap-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#0891B2] cursor-pointer"
                          onClick={() => setView('lawyer')}>
                          <Gavel size={9} /> {t.legalCase}
                        </motion.span>
                      )}
                    </span>
                  );
                })}
              </div>
              <div className="h-[260px] sm:h-[340px] md:h-[380px] rounded-xl p-2 sm:p-3" style={{ background: dk ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trChartData} margin={{ top: 22, right: 10, left: 5, bottom: 5 }}
                    barCategoryGap="22%">
                    <defs>
                      {trProps.map(p => {
                        const c = PROPERTY_COLORS[p.name] || getPropertyColor(p.name);
                        return (
                          <linearGradient key={p.name} id={`grad-tr-${p.name.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={c} stopOpacity={1} />
                            <stop offset="100%" stopColor={c} stopOpacity={0.6} />
                          </linearGradient>
                        );
                      })}
                    </defs>
                    <CartesianGrid vertical={false} stroke={dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false}
                      tick={{ fill: dk ? '#848E9C' : '#94A3B8', fontSize: 11, fontWeight: 600 }}
                      dy={8} />
                    <YAxis axisLine={false} tickLine={false} width={55}
                      tick={{ fill: dk ? '#848E9C' : '#94A3B8', fontSize: 10, fontWeight: 500 }}
                      tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip currency="TRY" rate={rate} aedRate={aedRate} />}
                      cursor={{ fill: dk ? 'rgba(246,70,93,0.06)' : 'rgba(246,70,93,0.04)', radius: 8 }}
                      trigger="hover" wrapperStyle={{ pointerEvents: 'none' }} />
                    {trProps.map((p, i) => (
                      <Bar key={p.name} dataKey={p.name} stackId="a"
                        fill={`url(#grad-tr-${p.name.replace(/\s/g,'')})`}
                        shape={StackedBarShape(trProps.map(pp => pp.name))}
                        animationDuration={isFirstLoad.current ? 1200 : 800}
                        animationBegin={isFirstLoad.current ? 600 + i * 120 : i * 80}
                        animationEasing="ease-out">
                        {i === trProps.length - 1 && (
                          <LabelList position="top"
                            content={({ x, y, width, index }) => (
                              <CagrLabel x={x} y={y} width={width} index={index}
                                data={trChartData} accentColor="#FCD535" />
                            )} />
                        )}
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>




            {/* ─── DUBAI TABLE (Excel-like) ─────────────────── */}
            {dxbProps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: isFirstLoad.current ? 1.2 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-6 sm:mb-10">
                <RegionTable properties={dxbProps} title={t.dubaiPortfolio} region="dubai" currency="AED"
                  rate={rate} aedRate={aedRate} t={t} onSelect={selectProp}
                  onAdd={isViewer ? null : () => { previousViewRef.current = 'dashboard'; setAddRegion('dubai'); setView('addProperty'); }}
                  onUpdateShops={handleUpdateShops} legalCases={legalCases} />
              </motion.div>
            )}

            {/* ─── TURKEY TABLE (Excel-like) ────────────────── */}
            {trProps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: isFirstLoad.current ? 1.4 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-6 sm:mb-10">
                <RegionTable properties={trProps} title={t.turkeyPortfolio} region="turkey" currency="TRY"
                  rate={rate} aedRate={aedRate} t={t} onSelect={selectProp}
                  onAdd={() => { previousViewRef.current = 'dashboard'; setAddRegion('turkey'); setView('addProperty'); }}
                  onUpdateShops={handleUpdateShops} legalCases={legalCases} />
              </motion.div>
            )}

            {/* ─── DUBAI PROPERTY CARDS ────────────────────── */}
            {dxbProps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: isFirstLoad.current ? 1.6 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-6 sm:mb-10 px-0.5">
                <h2 className="text-base sm:text-lg font-bold th-text flex items-center gap-2 mb-3 sm:mb-4 px-1">
                  <Flag region="dubai" size={20} />
                  <span className="gradient-text">{t.dubaiProperties}</span>
                  <span className="text-xs th-text-sec font-medium ml-auto">{dxbUnits} {lang === 'cn' ? '物业' : 'units'}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {dxbProps.map(p => (
                    <PropertyCard key={p.id} property={p} onClick={() => selectProp(p)}
                      onUpdateShops={handleUpdateShops} t={t} lang={lang} rate={rate} aedRate={aedRate} legalCases={legalCases}
                      onNavigateToLawyer={() => setView('lawyer')} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── TURKEY PROPERTY CARDS ───────────────────── */}
            {trProps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: isFirstLoad.current ? 1.8 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-6 sm:mb-10 px-0.5">
                <h2 className="text-base sm:text-lg font-bold th-text flex items-center gap-2 mb-3 sm:mb-4 px-1">
                  <Flag region="turkey" size={20} />
                  <span className="gradient-text">{t.turkeyProperties}</span>
                  <span className="text-xs th-text-sec font-medium ml-auto">{trUnits} {lang === 'cn' ? '物业' : 'units'}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {trProps.map(p => (
                    <PropertyCard key={p.id} property={p} onClick={() => selectProp(p)}
                      onUpdateShops={handleUpdateShops} t={t} lang={lang} rate={rate} aedRate={aedRate} legalCases={legalCases}
                      onNavigateToLawyer={() => setView('lawyer')} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <div className="text-center text-xs th-text-sec font-bold mt-8 mb-4 flex items-center justify-center gap-2">
              <img src="/logo.png" alt="" className="w-5 h-5 rounded" />
              Designed by Syed at Queen's Business School, Belfast, Northern Ireland, UK &copy; {new Date().getFullYear()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DELETE CONFIRMATION MODAL (global overlay) ─── */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDeleteModal
            property={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* ─── DELETE PERMISSION DENIED TOAST ─── */}
      <AnimatePresence>
        {deletePermissionDenied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
            style={{ background: '#1E2329', border: '1px solid rgba(230,57,70,0.3)' }}
          >
            <ShieldAlert size={18} className="text-[#e63946] shrink-0" />
            <div>
              <p className="text-[#EAECEF] text-sm font-bold">Delete requires admin approval</p>
              <p className="text-[#848E9C] text-[10px] font-medium">Contact Leomars or Syed to delete this property.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
