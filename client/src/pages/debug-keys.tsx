import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugKeys() {
  const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Debug Stripe Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">VITE_STRIPE_PUBLIC_KEY:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono break-all">
              {publicKey || "Not set"}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Should start with "pk_" for publishable key
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Key Type Analysis:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              {publicKey ? (
                <>
                  <p>Key starts with: <strong>{publicKey.substring(0, 3)}</strong></p>
                  <p>Key length: <strong>{publicKey.length}</strong></p>
                  <p>Is publishable key: <strong>{publicKey.startsWith('pk_') ? 'Yes' : 'No'}</strong></p>
                  <p>Is secret key: <strong>{publicKey.startsWith('sk_') ? 'Yes' : 'No'}</strong></p>
                </>
              ) : (
                <p>No key found</p>
              )}
            </div>
          </div>

          <div className="bg-yellow-100 p-3 rounded">
            <h4 className="font-semibold text-yellow-800">Expected Key Format:</h4>
            <ul className="text-sm text-yellow-700 mt-1">
              <li>• Publishable key: pk_test_... or pk_live_...</li>
              <li>• Secret key: sk_test_... or sk_live_...</li>
              <li>• Only publishable keys should be used on frontend</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}