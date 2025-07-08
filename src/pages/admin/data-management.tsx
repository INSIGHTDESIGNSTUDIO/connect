import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Auth } from '@/components/Auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Download, 
  Upload, 
  FileText, 
  Users, 
  LayoutGrid, 
  UserCog, 
  Database,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function DataManagementPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [exportResult, setExportResult] = useState<any>(null);
  const [overwriteEnabled, setOverwriteEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async (type: string) => {
    setLoading(true);
    setExportResult(null);
    
    try {
      const response = await fetch(`/api/admin/export?type=${type}`);
      const data = await response.json();
      
      if (response.ok) {
        // Create download link
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `connect-plus-${type}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setExportResult({
          success: true,
          message: `Successfully exported ${type} data`,
          count: data.count || data.counts
        });
      } else {
        setExportResult({
          success: false,
          message: data.message || 'Export failed'
        });
      }
    } catch (error) {
      setExportResult({
        success: false,
        message: 'Export failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    setLoading(true);
    setImportResult(null);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          overwrite: overwriteEnabled
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setImportResult({
          success: true,
          message: 'Import completed successfully',
          results: result.results
        });
      } else {
        setImportResult({
          success: false,
          message: result.message || 'Import failed'
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Import failed: ' + (error instanceof Error ? error.message : 'Invalid JSON file')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>;
  }

  if (status !== 'authenticated') {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <Auth />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <AdminHeader activeSection="data-management" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Data Management</h1>
        <p className="text-gray-600">Export and import data for backup and batch operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Section */}
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Download className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Export Data</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Download your data in JSON format for backup or migration purposes.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => handleExport('full')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                <Database className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
              
              <Button
                onClick={() => handleExport('resources')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Resources Only
              </Button>
              
              <Button
                onClick={() => handleExport('roles')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                <Users className="h-4 w-4 mr-2" />
                Export Roles Only
              </Button>
              
              <Button
                onClick={() => handleExport('needs')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Export Needs Only
              </Button>
              
              <Button
                onClick={() => handleExport('users')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                <UserCog className="h-4 w-4 mr-2" />
                Export Users Only
              </Button>
            </div>
            
            {exportResult && (
              <div className={`mt-4 p-3 rounded-md ${
                exportResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {exportResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm ${
                    exportResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {exportResult.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Import Section */}
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold">Import Data</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Upload JSON files to import data. Use exported files from this system for best compatibility.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="overwrite"
                  checked={overwriteEnabled}
                  onChange={(e) => setOverwriteEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="overwrite" className="ml-2 text-sm text-gray-700">
                  Overwrite existing entries
                </label>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to select a JSON file or drag and drop
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Select File
                </Button>
              </div>
              
              {importResult && (
                <div className={`p-4 rounded-md ${
                  importResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center mb-2">
                    {importResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${
                      importResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {importResult.message}
                    </span>
                  </div>
                  
                  {importResult.results && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Created: {importResult.results.created}</p>
                      <p>Updated: {importResult.results.updated}</p>
                      <p>Errors: {importResult.results.errors.length}</p>
                      
                      {importResult.results.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium text-red-700">Errors:</p>
                          <ul className="list-disc list-inside text-red-600">
                            {importResult.results.errors.slice(0, 5).map((error: string, index: number) => (
                              <li key={index}>{error}</li>
                            ))}
                            {importResult.results.errors.length > 5 && (
                              <li>... and {importResult.results.errors.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Instructions Section */}
      <Card className="mt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Instructions</h3>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800">Export Format</h4>
              <p>
                Exported files contain structured JSON data with metadata including export timestamp 
                and record counts. All data types maintain their original structure and relationships.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800">Import Behavior</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Without overwrite: Only creates new entries, skips existing ones</li>
                <li>With overwrite: Updates existing entries and creates new ones</li>
                <li>Validation ensures required fields are present before import</li>
                <li>User passwords are required for new user creation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800">Best Practices</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Always backup your data before importing</li>
                <li>Test imports on a copy of your system first</li>
                <li>Review the import results carefully</li>
                <li>Use the overwrite option cautiously</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}