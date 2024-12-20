import { Button } from "@/components/ui/button";
import SignInButton from "../Buttons/SignInButton";
import SignUpButton from "../Buttons/SignUpButton";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-2 ml-4">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-primary"
            >
              <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
            </svg>
            <h2 className="text-lg font-bold">DivvyUp</h2>
          </div>

          <nav className="flex items-center space-x-2">
            <Button variant="ghost">How it works</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">About us</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex justify-center items-center px-4 py-8 md:py-12">
        <div
            className="relative w-full max-w-4xl min-h-[60vh] md:min-h-[80vh] rounded-xl bg-cover bg-center bg-no-repeat"
            style={{
            backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/5d48bf56-5c84-4bcb-92ed-8598aa9bab28.png")',
            }}
        >
            {/* Hero Content */}
            <div className="absolute bottom-6 left-6 text-left text-white space-y-4 md:bottom-10 md:left-10">
                <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
                    Never worry about splitting bills again
                </h1>
                <p className="text-sm md:text-lg text-white">
                    DivvyUp makes it easy to split the check, pay rent, or share the cost of
                    a gift. With just a few taps, you can settle up with friends and family,
                    no matter where they are.
                </p>
                <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                    <SignUpButton/>
                    <SignInButton/>
                </div>
            </div>
        </div>
      </main>

    </div>
  );
};

export default LandingPage;
