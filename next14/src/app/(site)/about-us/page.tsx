import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About Overseas.ai</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Overseas.ai is dedicated to connecting skilled workers with international job opportunities. 
              We bridge the gap between talent and global employers, providing a comprehensive platform 
              for overseas employment, training, and skill development.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>International job placement services</li>
              <li>Skills training and certification programs</li>
              <li>Trade testing and qualification assessment</li>
              <li>Career guidance and counseling</li>
              <li>Resume building and profile enhancement</li>
              <li>Interview preparation and placement support</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              To become the leading platform for international workforce mobility, 
              empowering individuals to achieve their career aspirations abroad while 
              meeting the global demand for skilled professionals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
