import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Switch 
} from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Shea Ghana Marketplace",
    siteDescription: "Premium marketplace for authentic Ghanaian shea products",
    contactEmail: "info@sheaghana.com",
    contactPhone: "+233 55 123 4567",
    address: "123 Market Street, Accra, Ghana"
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "GHS",
    paymentGateway: "PayStack",
    testMode: true,
    apiKey: "pk_test_123456789",
    secretKey: "sk_test_987654321"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderConfirmations: true,
    stockAlerts: true,
    marketingEmails: false,
    adminAlerts: true
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your marketplace general settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName" 
                  name="siteName" 
                  value={generalSettings.siteName} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea 
                  id="siteDescription" 
                  name="siteDescription" 
                  value={generalSettings.siteDescription} 
                  onChange={handleGeneralSettingsChange} 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  name="contactEmail" 
                  type="email" 
                  value={generalSettings.contactEmail} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input 
                  id="contactPhone" 
                  name="contactPhone" 
                  value={generalSettings.contactPhone} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  value={generalSettings.address} 
                  onChange={handleGeneralSettingsChange} 
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure your marketplace payment options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input 
                  id="currency" 
                  name="currency" 
                  value={paymentSettings.currency} 
                  onChange={handlePaymentSettingsChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentGateway">Payment Gateway</Label>
                <Input 
                  id="paymentGateway" 
                  name="paymentGateway" 
                  value={paymentSettings.paymentGateway} 
                  onChange={handlePaymentSettingsChange} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="testMode" 
                  checked={paymentSettings.testMode} 
                  onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, testMode: checked }))} 
                />
                <Label htmlFor="testMode">Test Mode</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input 
                  id="apiKey" 
                  name="apiKey" 
                  value={paymentSettings.apiKey} 
                  onChange={handlePaymentSettingsChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input 
                  id="secretKey" 
                  name="secretKey" 
                  type="password" 
                  value={paymentSettings.secretKey} 
                  onChange={handlePaymentSettingsChange} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage your email and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="emailNotifications" 
                  checked={notificationSettings.emailNotifications} 
                  onCheckedChange={(checked) => handleToggleChange("emailNotifications", checked)} 
                />
                <Label htmlFor="emailNotifications">Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="orderConfirmations" 
                  checked={notificationSettings.orderConfirmations} 
                  onCheckedChange={(checked) => handleToggleChange("orderConfirmations", checked)} 
                />
                <Label htmlFor="orderConfirmations">Order Confirmations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="stockAlerts" 
                  checked={notificationSettings.stockAlerts} 
                  onCheckedChange={(checked) => handleToggleChange("stockAlerts", checked)} 
                />
                <Label htmlFor="stockAlerts">Low Stock Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="marketingEmails" 
                  checked={notificationSettings.marketingEmails} 
                  onCheckedChange={(checked) => handleToggleChange("marketingEmails", checked)} 
                />
                <Label htmlFor="marketingEmails">Marketing Emails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="adminAlerts" 
                  checked={notificationSettings.adminAlerts} 
                  onCheckedChange={(checked) => handleToggleChange("adminAlerts", checked)} 
                />
                <Label htmlFor="adminAlerts">Admin Alerts</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="pt-4">
                <Button>Change Password</Button>
              </div>
              
              <div className="pt-6 border-t mt-6">
                <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;