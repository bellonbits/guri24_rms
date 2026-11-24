import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';

/**
 * Heroicons adapter ensuring heroicons.com icons support:
 * - size prop: size={18} -> width: 18px, height: 18px
 * - color prop: color="#2563eb" -> color: #2563eb
 * - className & standard SVG props
 */
function createHeroicon(IconComponent: React.ComponentType<any>) {
  const Wrapped = React.forwardRef<SVGSVGElement, any>(({ size, color, style, className, ...props }, ref) => {
    const computedStyle: React.CSSProperties = {
      ...(size ? { width: `${size}px`, height: `${size}px`, flexShrink: 0 } : {}),
      ...(color ? { color } : {}),
      ...style,
    };
    return <IconComponent ref={ref} style={computedStyle} className={className} {...props} />;
  });
  Wrapped.displayName = IconComponent.displayName || 'Heroicon';
  return Wrapped;
}

// ---------------------------------------------------------------------------
// Standard Heroicons (heroicons.com)
// ---------------------------------------------------------------------------
export const Squares2X2Icon = createHeroicon(OutlineIcons.Squares2X2Icon);
export const BuildingOffice2Icon = createHeroicon(OutlineIcons.BuildingOffice2Icon);
export const BuildingOfficeIcon = createHeroicon(OutlineIcons.BuildingOfficeIcon);
export const CreditCardIcon = createHeroicon(OutlineIcons.CreditCardIcon);
export const DocumentTextIcon = createHeroicon(OutlineIcons.DocumentTextIcon);
export const HomeIcon = createHeroicon(OutlineIcons.HomeIcon);
export const ClipboardDocumentCheckIcon = createHeroicon(OutlineIcons.ClipboardDocumentCheckIcon);
export const WrenchScrewdriverIcon = createHeroicon(OutlineIcons.WrenchScrewdriverIcon);
export const FolderIcon = createHeroicon(OutlineIcons.FolderIcon);
export const ChatBubbleLeftRightIcon = createHeroicon(OutlineIcons.ChatBubbleLeftRightIcon);
export const ChatBubbleOvalLeftEllipsisIcon = createHeroicon(OutlineIcons.ChatBubbleOvalLeftEllipsisIcon);
export const MegaphoneIcon = createHeroicon(OutlineIcons.MegaphoneIcon);
export const BellIcon = createHeroicon(OutlineIcons.BellIcon);
export const BoltIcon = createHeroicon(OutlineIcons.BoltIcon);
export const LifebuoyIcon = createHeroicon(OutlineIcons.LifebuoyIcon);
export const UserIcon = createHeroicon(OutlineIcons.UserIcon);
export const UserCircleIcon = createHeroicon(OutlineIcons.UserCircleIcon);
export const Cog6ToothIcon = createHeroicon(OutlineIcons.Cog6ToothIcon);
export const ArrowRightOnRectangleIcon = createHeroicon(OutlineIcons.ArrowRightOnRectangleIcon);
export const Bars3Icon = createHeroicon(OutlineIcons.Bars3Icon);
export const XMarkIcon = createHeroicon(OutlineIcons.XMarkIcon);
export const ChevronLeftIcon = createHeroicon(OutlineIcons.ChevronLeftIcon);
export const ChevronRightIcon = createHeroicon(OutlineIcons.ChevronRightIcon);
export const ChevronDownIcon = createHeroicon(OutlineIcons.ChevronDownIcon);
export const ShieldCheckIcon = createHeroicon(OutlineIcons.ShieldCheckIcon);
export const CheckCircleIcon = createHeroicon(OutlineIcons.CheckCircleIcon);
export const CheckIcon = createHeroicon(OutlineIcons.CheckIcon);
export const MagnifyingGlassIcon = createHeroicon(OutlineIcons.MagnifyingGlassIcon);
export const ArrowTopRightOnSquareIcon = createHeroicon(OutlineIcons.ArrowTopRightOnSquareIcon);
export const ExclamationCircleIcon = createHeroicon(OutlineIcons.ExclamationCircleIcon);
export const QuestionMarkCircleIcon = createHeroicon(OutlineIcons.QuestionMarkCircleIcon);
export const ClockIcon = createHeroicon(OutlineIcons.ClockIcon);
export const ArrowDownTrayIcon = createHeroicon(OutlineIcons.ArrowDownTrayIcon);
export const ArrowUpTrayIcon = createHeroicon(OutlineIcons.ArrowUpTrayIcon);
export const PlusIcon = createHeroicon(OutlineIcons.PlusIcon);
export const PaperAirplaneIcon = createHeroicon(OutlineIcons.PaperAirplaneIcon);
export const DevicePhoneMobileIcon = createHeroicon(OutlineIcons.DevicePhoneMobileIcon);
export const InformationCircleIcon = createHeroicon(OutlineIcons.InformationCircleIcon);
export const CalendarDaysIcon = createHeroicon(OutlineIcons.CalendarDaysIcon);
export const CalendarIcon = createHeroicon(OutlineIcons.CalendarIcon);
export const ExclamationTriangleIcon = createHeroicon(OutlineIcons.ExclamationTriangleIcon);
export const EyeIcon = createHeroicon(OutlineIcons.EyeIcon);
export const EyeSlashIcon = createHeroicon(OutlineIcons.EyeSlashIcon);
export const PrinterIcon = createHeroicon(OutlineIcons.PrinterIcon);
export const PhoneIcon = createHeroicon(OutlineIcons.PhoneIcon);
export const ArrowPathIcon = createHeroicon(OutlineIcons.ArrowPathIcon);
export const ArchiveBoxIcon = createHeroicon(OutlineIcons.ArchiveBoxIcon);
export const FaceSmileIcon = createHeroicon(OutlineIcons.FaceSmileIcon);
export const PaperClipIcon = createHeroicon(OutlineIcons.PaperClipIcon);
export const ArrowRightIcon = createHeroicon(OutlineIcons.ArrowRightIcon);
export const ArrowLeftIcon = createHeroicon(OutlineIcons.ArrowLeftIcon);
export const CurrencyDollarIcon = createHeroicon(OutlineIcons.CurrencyDollarIcon);
export const SparklesIcon = createHeroicon(OutlineIcons.SparklesIcon);
export const KeyIcon = createHeroicon(OutlineIcons.KeyIcon);
export const SunIcon = createHeroicon(OutlineIcons.SunIcon);
export const MoonIcon = createHeroicon(OutlineIcons.MoonIcon);
export const ComputerDesktopIcon = createHeroicon(OutlineIcons.ComputerDesktopIcon);
export const LockClosedIcon = createHeroicon(OutlineIcons.LockClosedIcon);
export const CameraIcon = createHeroicon(OutlineIcons.CameraIcon);
export const ArrowTrendingDownIcon = createHeroicon(OutlineIcons.ArrowTrendingDownIcon);
export const ArrowTrendingUpIcon = createHeroicon(OutlineIcons.ArrowTrendingUpIcon);
export const ArrowUpRightIcon = createHeroicon(OutlineIcons.ArrowUpRightIcon);
export const ArrowDownRightIcon = createHeroicon(OutlineIcons.ArrowDownRightIcon);
export const StarIcon = createHeroicon(OutlineIcons.StarIcon);
export const ShieldExclamationIcon = createHeroicon(OutlineIcons.ShieldExclamationIcon);
export const FunnelIcon = createHeroicon(OutlineIcons.FunnelIcon);
export const EnvelopeIcon = createHeroicon(OutlineIcons.EnvelopeIcon);
export const MapPinIcon = createHeroicon(OutlineIcons.MapPinIcon);
export const TruckIcon = createHeroicon(OutlineIcons.TruckIcon);
export const BanknotesIcon = createHeroicon(OutlineIcons.BanknotesIcon);

// ---------------------------------------------------------------------------
// Named aliases mapping standard semantic names to official Heroicons
// ---------------------------------------------------------------------------
export const LayoutDashboard = Squares2X2Icon;
export const Building = BuildingOffice2Icon;
export const Building2 = BuildingOffice2Icon;
export const CreditCard = CreditCardIcon;
export const FileText = DocumentTextIcon;
export const FileCheck = DocumentTextIcon;
export const Home = HomeIcon;
export const ClipboardCheck = ClipboardDocumentCheckIcon;
export const Wrench = WrenchScrewdriverIcon;
export const FolderLock = FolderIcon;
export const Folder = FolderIcon;
export const MessageSquare = ChatBubbleLeftRightIcon;
export const Megaphone = MegaphoneIcon;
export const Bell = BellIcon;
export const Zap = BoltIcon;
export const LifeBuoy = LifebuoyIcon;
export const User = UserIcon;
export const Settings = Cog6ToothIcon;
export const LogOut = ArrowRightOnRectangleIcon;
export const Menu = Bars3Icon;
export const X = XMarkIcon;
export const PanelLeftClose = ChevronLeftIcon;
export const PanelLeft = ChevronRightIcon;
export const ChevronRight = ChevronRightIcon;
export const ChevronLeft = ChevronLeftIcon;
export const ChevronDown = ChevronDownIcon;
export const ShieldCheck = ShieldCheckIcon;
export const Shield = ShieldCheckIcon;
export const ShieldAlert = ShieldExclamationIcon;
export const CheckCircle2 = CheckCircleIcon;
export const CheckCircle = CheckCircleIcon;
export const Check = CheckIcon;
export const Search = MagnifyingGlassIcon;
export const ExternalLink = ArrowTopRightOnSquareIcon;
export const AlertCircle = ExclamationCircleIcon;
export const AlertTriangle = ExclamationTriangleIcon;
export const HelpCircle = QuestionMarkCircleIcon;
export const Clock = ClockIcon;
export const Download = ArrowDownTrayIcon;
export const Upload = ArrowUpTrayIcon;
export const Plus = PlusIcon;
export const Send = PaperAirplaneIcon;
export const Smartphone = DevicePhoneMobileIcon;
export const Info = InformationCircleIcon;
export const Calendar = CalendarDaysIcon;
export const Eye = EyeIcon;
export const EyeOff = EyeSlashIcon;
export const Printer = PrinterIcon;
export const Phone = PhoneIcon;
export const PhoneCall = PhoneIcon;
export const RefreshCw = ArrowPathIcon;
export const Archive = ArchiveBoxIcon;
export const Smile = FaceSmileIcon;
export const Paperclip = PaperClipIcon;
export const ArrowRight = ArrowRightIcon;
export const ArrowLeft = ArrowLeftIcon;
export const ArrowUpRight = ArrowUpRightIcon;
export const ArrowDownRight = ArrowDownRightIcon;
export const DollarSign = CurrencyDollarIcon;
export const Sparkles = SparklesIcon;
export const Key = KeyIcon;
export const Lock = LockClosedIcon;
export const Sun = SunIcon;
export const Moon = MoonIcon;
export const Laptop = ComputerDesktopIcon;
export const Globe = OutlineIcons.GlobeAltIcon ? createHeroicon(OutlineIcons.GlobeAltIcon) : Squares2X2Icon;
export const Camera = CameraIcon;
export const TrendingDown = ArrowTrendingDownIcon;
export const TrendingUp = ArrowTrendingUpIcon;
export const Filter = FunnelIcon;
export const Star = StarIcon;
export const Mail = EnvelopeIcon;
export const MapPin = MapPinIcon;
export const Car = TruckIcon;
export const Droplets = createHeroicon(OutlineIcons.BeakerIcon || BoltIcon);
export const Volume2 = MegaphoneIcon;
export const FileQuestion = DocumentTextIcon;
