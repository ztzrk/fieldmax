import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllFieldsTable } from "./components/FieldsTable";
import { VenuesTable } from "./components/VenuesTable";

export default function VenuesAndFieldsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Venues & Fields</h1>
                <p className="text-muted-foreground">
                    Manage all venues and fields in the system.
                </p>
            </div>
            <Tabs defaultValue="venues" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="venues">Venues</TabsTrigger>
                    <TabsTrigger value="fields">All Fields</TabsTrigger>
                </TabsList>
                <TabsContent value="venues">
                    <VenuesTable />
                </TabsContent>
                <TabsContent value="fields">
                    <AllFieldsTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
