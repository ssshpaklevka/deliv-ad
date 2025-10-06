import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  icons: React.ReactElement;
  title: string;
  count: number;
}

const CardInfo = ({ icons, title, count }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icons}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{count}</p>
      </CardContent>
    </Card>
  );
};
export default CardInfo;
