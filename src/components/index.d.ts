// =============================================================================
// NativeDocument Components — index.d.ts
// Barrel export for all component type definitions.
// =============================================================================

// --- Base & Traits -----------------------------------------------------------
export type { BaseComponent } from './BaseComponent';
export type { HasDraggable } from './$traits/has-draggable/HasDraggable';
export type { HasItems } from './$traits/has-items/HasItems';
export type { HasPosition } from './$traits/has-position/HasPosition';
export type { HasFullPosition } from './$traits/has-position/HasFullPosition';
export type { HasResizable } from './$traits/has-resizable/HasResizable';
export type { HasValidation } from './$traits/has-validation/HasValidation';

// --- Accordion ---------------------------------------------------------------
export type { Accordion, AccordionInterface, AccordionDescription } from './accordion/types/Accordion';
export type { AccordionItem, AccordionItemInterface, AccordionItemDescription } from './accordion/types/AccordionItem';

// --- Alert -------------------------------------------------------------------
export type { Alert, AlertInterface, AlertDescription } from './alert/types/Alert';

// --- Avatar ------------------------------------------------------------------
export type { Avatar, AvatarInterface, AvatarDescription } from './avatar/types/Avatar';
export type { AvatarGroup, AvatarGroupInterface, AvatarGroupDescription } from './avatar/types/AvatarGroup';

// --- Badge -------------------------------------------------------------------
export type { Badge, BadgeInterface, BadgeDescription } from './badge/types/Badge';

// --- Breadcrumb --------------------------------------------------------------
export type { BreadCrumb, BreadCrumbInterface, BreadCrumbDescription } from './breadcrumb/types/BreadCrumb';

// --- Button ------------------------------------------------------------------
export type { Button, ButtonInterface, ButtonDescription } from './button/types/Button';

// --- Card --------------------------------------------------------------------
export type { Card, CardInterface, CardDescription } from './card/types/Card';

// --- Context Menu ------------------------------------------------------------
export type { ContextMenu, ContextMenuInterface, ContextMenuDescription } from './context-menu/types/ContextMenu';
export type { ContextMenuGroup, ContextMenuGroupInterface } from './context-menu/types/ContextMenuGroup';
export type { ContextMenuItem, ContextMenuItemInterface } from './context-menu/types/ContextMenuItem';

// --- Divider -----------------------------------------------------------------
export type { Divider, DividerInterface, DividerDescription } from './divider/types/Divider';

// --- Dropdown ----------------------------------------------------------------
export type { Dropdown, DropdownInterface, DropdownDescription } from './dropdown/types/Dropdown';
export type { DropdownDivider, DropdownDividerInterface } from './dropdown/types/DropdownDivider';
export type { DropdownGroup, DropdownGroupInterface } from './dropdown/types/DropdownGroup';
export type { DropdownItem, DropdownItemInterface, DropdownItemDescription } from './dropdown/types/DropdownItem';
export type { DropdownTrigger, DropdownTriggerInterface, DropdownTriggerDescription } from './dropdown/types/DropdownTrigger';

// --- Form --------------------------------------------------------------------
export type { FormControl, FormControlInterface, FormControlDescription } from './form/types/FormControl';
export type { Field, FieldInterface, FieldDescription } from './form/types/Field';
export type { FieldCollection, FieldCollectionInterface, FieldCollectionDescription } from './form/types/FieldCollection';
export type { StringField, StringFieldInterface } from './form/types/fields/StringField';
export type { NumberField, NumberFieldInterface } from './form/types/fields/NumberField';
export type { EmailField, EmailFieldInterface } from './form/types/fields/EmailField';
export type { PasswordField, PasswordFieldInterface } from './form/types/fields/PasswordField';
export type { TelField, TelFieldInterface } from './form/types/fields/TelField';
export type { UrlField, UrlFieldInterface } from './form/types/fields/UrlField';
export type { TextAreaField, TextAreaFieldInterface } from './form/types/fields/TextAreaField';
export type { CheckboxField, CheckboxFieldInterface } from './form/types/fields/CheckboxField';
export type { CheckboxGroupField, CheckboxGroupFieldInterface } from './form/types/fields/CheckboxGroupField';
export type { RadioField, RadioFieldInterface } from './form/types/fields/RadioField';
export type { SelectField, SelectFieldInterface } from './form/types/fields/SelectField';
export type { AutocompleteField, AutocompleteFieldInterface } from './form/types/fields/AutocompleteField';
export type { HiddenField, HiddenFieldInterface } from './form/types/fields/HiddenField';
export type { ColorField, ColorFieldInterface } from './form/types/fields/ColorField';
export type { DateField, DateFieldInterface } from './form/types/fields/DateField';
export type { TimeField, TimeFieldInterface } from './form/types/fields/TimeField';
export type { RangeField, RangeFieldInterface } from './form/types/fields/RangeField';
export type { SearchField, SearchFieldInterface } from './form/types/fields/SearchField';
export type { FileField, FileFieldInterface } from './form/types/fields/FileField';
export type { ImageField, ImageFieldInterface } from './form/types/fields/ImageField';
export type { FileAvatarMode, FileAvatarModeInterface, FileAvatarModeDescription } from './form/types/fields/FileAvatarMode';
export type { FileDropzoneMode, FileDropzoneModeInterface, FileDropzoneModeDescription } from './form/types/fields/FileDropzoneMode';
export type { FileItemPreview, FileItemPreviewInterface, FileItemPreviewDescription } from './form/types/fields/FileItemPreview';
export type { FileNativeMode, FileNativeModeInterface, FileNativeModeDescription } from './form/types/fields/FileNativeMode';
export type { FileUploadButtonMode, FileUploadButtonModeInterface, FileUploadButtonModeDescription } from './form/types/fields/FileUploadButtonMode';
export type { FileWallMode, FileWallModeInterface, FileWallModeDescription } from './form/types/fields/FileWallMode';

// --- List --------------------------------------------------------------------
export type { List, ListInterface, ListDescription } from './list/types/List';
export type { ListGroup, ListGroupInterface, ListGroupDescription } from './list/types/ListGroup';
export type { ListItem, ListItemInterface, ListItemDescription } from './list/types/ListItem';

// --- Menu --------------------------------------------------------------------
export type { Menu, MenuInterface, MenuDescription } from './menu/types/Menu';
export type { MenuDivider, MenuDividerInterface, MenuDividerDescription } from './menu/types/MenuDivider';
export type { MenuGroup, MenuGroupInterface, MenuGroupDescription } from './menu/types/MenuGroup';
export type { MenuItem, MenuItemInterface, MenuItemDescription } from './menu/types/MenuItem';
export type { MenuLink, MenuLinkInterface } from './menu/types/MenuLink';

// --- Modal -------------------------------------------------------------------
export type { Modal, ModalInterface, ModalDescription } from './modal/types/Modal';

// --- Pagination --------------------------------------------------------------
export type { Pagination, PaginationInterface, PaginationDescription } from './pagination/types/Pagination';

// --- Popover -----------------------------------------------------------------
export type { Popover, PopoverInterface, PopoverDescription } from './popover/types/Popover';
export type { PopoverFooter, PopoverFooterInterface, PopoverFooterDescription } from './popover/types/PopoverFooter';
export type { PopoverHeader, PopoverHeaderInterface, PopoverHeaderDescription } from './popover/types/PopoverHeader';

// --- Progress ----------------------------------------------------------------
export type { Progress, ProgressInterface, ProgressDescription } from './progress/types/Progress';

// --- Skeleton ----------------------------------------------------------------
export type { Skeleton, SkeletonInterface, SkeletonDescription } from './skeleton/types/Skeleton';

// --- Slider ------------------------------------------------------------------
export type { Slider, SliderInterface, SliderDescription } from './slider/types/Slider';

// --- Spacer ------------------------------------------------------------------
export type { Spacer, SpacerInterface, SpacerDescription } from './spacer/types/Spacer';

// --- Spinner -----------------------------------------------------------------
export type { Spinner, SpinnerInterface, SpinnerDescription } from './spinner/types/Spinner';

// --- Splitter ----------------------------------------------------------------
export type { Splitter, SplitterInterface, SplitterDescription } from './splitter/types/Splitter';
export type { SplitterGutter, SplitterGutterInterface, SplitterGutterDescription } from './splitter/types/SplitterGutter';
export type { SplitterPanel, SplitterPanelInterface, SplitterPanelDescription } from './splitter/types/SplitterPanel';

// --- Stacks ------------------------------------------------------------------
export type { Stack, StackInterface, StackDescription } from './stacks/types/Stack';
export type { HStack, HStackInterface } from './stacks/types/HStack';
export type { VStack, VStackInterface } from './stacks/types/VStack';
export type { PositionStack, PositionStackInterface, PositionStackDescription } from './stacks/types/PositionStack';
export type { AbsoluteStack, AbsoluteStackInterface } from './stacks/types/AbsoluteStack';
export type { FixedStack, FixedStackInterface } from './stacks/types/FixedStack';
export type { RelativeStack, RelativeStackInterface } from './stacks/types/RelativeStack';

// --- Stepper -----------------------------------------------------------------
export type { Stepper, StepperInterface, StepperDescription } from './stepper/types/Stepper';
export type { StepperStep, StepperStepInterface, StepperStepDescription } from './stepper/types/StepperStep';

// --- Switch ------------------------------------------------------------------
export type { Switch, SwitchInterface, SwitchDescription } from './switch/types/Switch';

// --- Table -------------------------------------------------------------------
export type { Column, ColumnInterface, ColumnDescription } from './table/types/Column';
export type { ColumnGroup, ColumnGroupInterface, ColumnGroupDescription } from './table/types/ColumnGroup';
export type { DataTable, DataTableInterface, DataTableDescription } from './table/types/DataTable';
export type { SimpleTable, SimpleTableInterface, SimpleTableDescription } from './table/types/SimpleTable';

// --- Tabs --------------------------------------------------------------------
export type { Tabs, TabsInterface, TabsDescription } from './tabs/types/Tabs';

// --- Toast -------------------------------------------------------------------
export type { Toast, ToastInterface, ToastDescription } from './toast/types/Toast';
export type { ToastError, ToastErrorInterface } from './toast/types/ToastError';
export type { ToastInfo, ToastInfoInterface } from './toast/types/ToastInfo';
export type { ToastSuccess, ToastSuccessInterface } from './toast/types/ToastSuccess';
export type { ToastWarning, ToastWarningInterface } from './toast/types/ToastWarning';

// --- Tooltip -----------------------------------------------------------------
export type { Tooltip, TooltipInterface, TooltipDescription } from './tooltip/types/Tooltip';
