import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  // 👇️ Get current Year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image
            src={"/BigDAOLogo2.svg"}
            alt="BigDAO Logo"
            width={40}
            height={40}
          />
          <span className="text-sm font-medium">BIG DAO</span>
        </Link>
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear} Creative Organization DAO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
