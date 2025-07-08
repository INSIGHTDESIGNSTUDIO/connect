import Link from 'next/link';

export default function SetupGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Supabase Setup Guide</h1>

      <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p>
          This guide will help you configure Supabase for this application and set up the
          required authentication and database for the admin features.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 1: Create a Supabase Project</h2>
          <ol className="list-decimal list-inside ml-4 space-y-3">
            <li>Sign up or sign in at <a href="https://supabase.com" className="text-blue-600 underline">supabase.com</a></li>
            <li>Click "New Project" to create a new project</li>
            <li>Choose a name for your project</li>
            <li>Set a secure database password (keep this safe)</li>
            <li>Choose a region closest to your users</li>
            <li>Wait for your project to be initialized (about 1-2 minutes)</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 2: Get Your API Credentials</h2>
          <ol className="list-decimal list-inside ml-4 space-y-3">
            <li>From your Supabase dashboard, go to "Project Settings" (gear icon)</li>
            <li>Select "API" in the sidebar</li>
            <li>Copy the "URL" and "anon key" values</li>
            <li>Create a new file named <code>.env.local</code> in your project root with:
              <pre className="bg-gray-100 p-3 mt-2 rounded-md">
                NEXT_PUBLIC_SUPABASE_URL=your-project-url<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
              </pre>
            </li>
            <li>Restart your development server if it's already running</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 3: Set Up Authentication</h2>
          <ol className="list-decimal list-inside ml-4 space-y-3">
            <li>In your Supabase dashboard, navigate to "Authentication"</li>
            <li>Under "Providers" make sure "Email" is enabled</li>
            <li>Optionally, you can disable "Email confirmations" during development</li>
            <li>Create an admin user:
              <ul className="list-disc ml-8 mt-2">
                <li>Go to "Users" tab</li>
                <li>Click "Add User"</li>
                <li>Enter an email and password for your admin account</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 4: Create the Resources Table</h2>
          <ol className="list-decimal list-inside ml-4 space-y-3">
            <li>In your Supabase dashboard, navigate to "Table Editor"</li>
            <li>Click "Create a new table"</li>
            <li>Name the table "resources"</li>
            <li>Enable Row Level Security (RLS)</li>
            <li>Add the following columns:
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white border border-gray-300 rounded-md mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Name</th>
                      <th className="py-2 px-4 border-b text-left">Type</th>
                      <th className="py-2 px-4 border-b text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b">id</td>
                      <td className="py-2 px-4 border-b">uuid</td>
                      <td className="py-2 px-4 border-b">Primary Key, Default: uuid_generate_v4()</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">title</td>
                      <td className="py-2 px-4 border-b">text</td>
                      <td className="py-2 px-4 border-b">Not Null</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">description</td>
                      <td className="py-2 px-4 border-b">text</td>
                      <td className="py-2 px-4 border-b">Not Null</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">url</td>
                      <td className="py-2 px-4 border-b">text</td>
                      <td className="py-2 px-4 border-b">Not Null</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">roles</td>
                      <td className="py-2 px-4 border-b">text[]</td>
                      <td className="py-2 px-4 border-b">Array type</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">needs</td>
                      <td className="py-2 px-4 border-b">text[]</td>
                      <td className="py-2 px-4 border-b">Array type</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">tags</td>
                      <td className="py-2 px-4 border-b">text[]</td>
                      <td className="py-2 px-4 border-b">Array type</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">featured</td>
                      <td className="py-2 px-4 border-b">boolean</td>
                      <td className="py-2 px-4 border-b">Default: false</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">updatedAt</td>
                      <td className="py-2 px-4 border-b">date</td>
                      <td className="py-2 px-4 border-b">Not Null</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">resourceType</td>
                      <td className="py-2 px-4 border-b">text</td>
                      <td className="py-2 px-4 border-b">Not Null</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 5: Create the Roles Table</h2>
          <ol className="list-decimal list-inside ml-4 space-y-3">
            <li>In your Supabase dashboard, navigate to "Table Editor"</li>
            <li>Click "Create a new table"</li>
            <li>Name the table "roles"</li>
            <li>Enable Row Level Security (RLS)</li>
            <li>Add the following columns:
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white border border-gray-300 rounded-md mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Name</th>
                      <th className="py-2 px-4 border-b text-left">Type</th>
                      <th className="py-2 px-4 border-b text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b">id</td>
                      <td className="py-2 px-4 border-b">uuid</td>
                      <td className="py-2 px-4 border-b">Primary Key, Default: uuid_generate_v4()</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">name</td>
                      <td className="py-2 px-4 border-b">text</td>
                      <td className="py-2 px-4 border-b">Not Null</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">description</td>
                      <td className="py-2 px-4 border-b">text</td>
                      <td className="py-2 px-4 border-b">Not Null</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">icon</td>
                      <td className="py-2 px-4 border-b">text</td>
                      <td className="py-2 px-4 border-b">Not Null</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">created_at</td>
                      <td className="py-2 px-4 border-b">timestamp with time zone</td>
                      <td className="py-2 px-4 border-b">Default: now()</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">updated_at</td>
                      <td className="py-2 px-4 border-b">timestamp with time zone</td>
                      <td className="py-2 px-4 border-b">Default: now()</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>Insert initial data for roles:
              <pre className="bg-gray-100 p-3 mt-2 rounded-md">
{`-- Execute this SQL in the SQL Editor
INSERT INTO roles (name, description, icon)
VALUES 
  ('HE Lecturer', 'Teaching in higher education institutions', 'BookOpen'),
  ('VET/TAFE Lecturer', 'Teaching in vocational education settings', 'School'),
  ('Unit Coordinator', 'Coordinating and managing educational units', 'Briefcase'),
  ('Professional Staff', 'Supporting educational delivery and operations', 'Users'),
  ('New to Teaching', 'Recently started teaching in any setting', 'GraduationCap');`}
              </pre>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 6: Set Row Level Security Policies</h2>
          <ol className="list-decimal list-inside ml-4 space-y-3">
            <li>Navigate to the "Authentication" → "Policies" page</li>
            <li>For the "resources" table, add these policies:
              <ul className="list-disc ml-8 mt-2 space-y-3">
                <li>
                  <strong>Allow anonymous read access:</strong><br/>
                  <ul className="ml-4">
                    <li>Policy name: "Allow anonymous read access"</li>
                    <li>Operation: SELECT</li>
                    <li>Target roles: Leave empty for public access</li>
                    <li>Policy definition: USING (true)</li>
                  </ul>
                </li>
                <li>
                  <strong>Allow authenticated users to manage resources:</strong><br/>
                  <ul className="ml-4">
                    <li>Policy name: "Allow authenticated users to manage resources"</li>
                    <li>Operation: ALL</li>
                    <li>Target roles: authenticated</li>
                    <li>Policy definition: USING (auth.role() = 'authenticated')</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>For the "roles" table, add these policies:
              <ul className="list-disc ml-8 mt-2 space-y-3">
                <li>
                  <strong>Allow anonymous read access:</strong><br/>
                  <ul className="ml-4">
                    <li>Policy name: "Allow anonymous read access to roles"</li>
                    <li>Operation: SELECT</li>
                    <li>Target roles: Leave empty for public access</li>
                    <li>Policy definition: USING (true)</li>
                  </ul>
                </li>
                <li>
                  <strong>Allow authenticated users to manage roles:</strong><br/>
                  <ul className="ml-4">
                    <li>Policy name: "Allow authenticated users to manage roles"</li>
                    <li>Operation: ALL</li>
                    <li>Target roles: authenticated</li>
                    <li>Policy definition: USING (auth.role() = 'authenticated')</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 7: Test Your Setup</h2>
          <ol className="list-decimal list-inside ml-4 space-y-3">
            <li>Verify your environment variables are set up correctly</li>
            <li>Visit the Supabase connection test page at <Link href="/test-supabase" className="text-blue-600 underline">/test-supabase</Link></li>
            <li>Try logging in at <Link href="/admin" className="text-blue-600 underline">/admin</Link> with your admin credentials</li>
            <li>After logging in, try creating a new resource and a new role</li>
          </ol>
        </section>
      </div>
      
      <div className="mt-12 bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <p>
          If you're having trouble with the Supabase setup, check out the 
          <a href="https://supabase.com/docs" className="text-blue-600 underline mx-1">Supabase documentation</a>
          or reach out to their support.
        </p>
      </div>
    </div>
  );
}