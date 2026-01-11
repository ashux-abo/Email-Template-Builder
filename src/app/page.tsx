import Link from "next/link";
import { cookies } from "next/headers";
import OptimizedImage from "../components/ui/optimized-image";

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token");
  const hasAuthCookie = !!authToken;

  return (
    <div className="bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Elements (Neutralized) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-slate-700/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-slate-800/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-700/5 rounded-full blur-3xl"></div>
      </div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-10 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <span className="text-sm font-medium text-slate-400">
                  Email Platform
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                  Email Template
                  <br />
                  <span className="text-indigo-400">Builder</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                  Design email templates exactly how you picture them. Reorder
                  sections with a click, position elements anywhere on the
                  canvas, break free from rigid layouts. Build templates your
                  community can customize for their own needs. Made for
                  marketers who want speed without sacrificing control, backed
                  by live preview that shows what recipients actually see.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {!hasAuthCookie ? (
                  <>
                    <Link
                      href="/register"
                      className="px-8 py-4 bg-indigo-600 rounded-xl font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-black/30"
                    >
                      Start Building Free
                    </Link>
                    <Link
                      href="/login"
                      className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-medium hover:bg-slate-700 transition-all"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-8 py-4 bg-indigo-600 rounded-xl font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-black/30"
                    >
                      Open Dashboard
                    </Link>
                    <Link
                      href="/dashboard/templates/visual/new"
                      className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-medium hover:bg-slate-700 transition-all"
                    >
                      New Template
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative lg:h-[700px] flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <OptimizedImage
                          src="/PaletteMail/Icon/pltmaild 32px.svg"
                          alt="PaletteMail"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                          priority
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          Email Builder
                        </div>
                        <div className="text-xs text-slate-500">
                          Template Editor
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
                    <div className="space-y-4">
                      <div className="h-3 bg-slate-700 rounded-full w-full"></div>
                      <div className="h-3 bg-slate-700 rounded-full w-4/5"></div>
                      <div className="h-3 bg-slate-700 rounded-full w-5/6"></div>
                      <div className="h-24 bg-slate-700 rounded-lg"></div>
                      <div className="flex justify-center pt-2">
                        <div className="px-6 py-2 bg-indigo-600 rounded-lg text-sm font-medium">
                          Launch Email
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-2">
                        RECIPIENTS
                      </div>
                      <div className="h-10 bg-slate-800 border border-slate-700 rounded-lg"></div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-2">
                        SUBJECT
                      </div>
                      <div className="h-10 bg-slate-800 border border-slate-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
                  <div className="text-sm font-medium">98% Deliverable</div>
                  <div className="text-xs text-slate-500">Inbox Ready</div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
                  <div className="text-sm font-medium">Real-time Preview</div>
                  <div className="text-xs text-slate-500">Live Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Bento Grid */}{" "}
      <section className="relative py-32">
        {" "}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {" "}
          <div className="text-center mb-20">
            {" "}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
              {" "}
              <span className="text-sm font-medium text-gray-400">
                {" "}
                PLATFORM FEATURES{" "}
              </span>{" "}
            </div>{" "}
            <h2 className="text-5xl font-bold mb-6">
              {" "}
              Built for modern <br />{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {" "}
                email experiences{" "}
              </span>{" "}
            </h2>{" "}
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {" "}
              Everything you need to design, manage, and deliver exceptional
              email campaigns{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {/* Feature 1 - Large */}{" "}
            <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all overflow-hidden">
              {" "}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>{" "}
              <div className="relative z-10">
                {" "}
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  {" "}
                  <svg
                    className="w-7 h-7 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
                <h3 className="text-2xl font-bold mb-3">
                  {" "}
                  Visual Email Builder{" "}
                </h3>{" "}
                <p className="text-gray-400 leading-relaxed">
                  {" "}
                  Design stunning emails with our intuitive editor. No coding
                  required.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            {/* Feature 3 */}{" "}
            <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all overflow-hidden">
              {" "}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>{" "}
              <div className="relative z-10">
                {" "}
                <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                  {" "}
                  <svg
                    className="w-7 h-7 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
                <h3 className="text-2xl font-bold mb-3">Secure Auth</h3>{" "}
                <p className="text-gray-400 leading-relaxed">
                  {" "}
                  Enterprise-grade security with 2FA and advanced authentication
                  protocols.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            {/* Feature 6 */}{" "}
            <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all overflow-hidden">
              {" "}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>{" "}
              <div className="relative z-10">
                {" "}
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                  {" "}
                  <svg
                    className="w-7 h-7 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
                <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>{" "}
                <p className="text-gray-400 leading-relaxed">
                  {" "}
                  Built for speed with optimized delivery infrastructure and
                  real-time previews.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>
      {/* CTA */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-20">
            <h2 className="text-5xl font-bold mb-6">
              Ready to transform your email marketing?
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Palette Mail gives you the tools to design, customize, and launch
              emails effortlessly.
            </p>
            <Link
              href={hasAuthCookie ? "/dashboard" : "/register"}
              className="px-10 py-5 bg-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-500 transition-all"
            >
              {hasAuthCookie ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
