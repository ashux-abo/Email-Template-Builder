import Link from "next/link";
import { cookies } from "next/headers";
import OptimizedImage from "../components/ui/optimized-image";

export default async function Home() {
  // Check if there's a token cookie to determine if user is logged in
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token");
  const hasAuthCookie = !!authToken;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
          <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_110%_90%,#3b82f6,transparent)]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-5">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Professional Email Solution
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Create stunning</span>
                  <span className="block text-primary">email designs</span>
                  <span className="block">with Palette Mail</span>
                </h1>
                <p className="mt-3 text-lg text-gray-600 md:text-xl">
                  Craft beautiful, responsive emails in minutes with our
                  intuitive visual builder. Personalize your content, manage
                  your contacts, and authenticate your communications securely
                  with Palette Mail.
                </p>
              </div>

              {!hasAuthCookie && (
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href="/register"
                    className="rounded-md bg-primary px-8 py-4 text-center text-base font-medium text-white shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl"
                  >
                    Start Creating For Free
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-md border border-gray-300 bg-white px-8 py-4 text-center text-base font-medium text-gray-700 shadow hover:bg-gray-50 transition-all"
                  >
                    Log In to Your Account
                  </Link>
                </div>
              )}

              {hasAuthCookie && (
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href="/dashboard"
                    className="rounded-md bg-primary px-8 py-4 text-center text-base font-medium text-white shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/dashboard/templates/visual/new"
                    className="rounded-md border border-gray-300 bg-white px-8 py-4 text-center text-base font-medium text-gray-700 shadow hover:bg-gray-50 transition-all"
                  >
                    Create New Template
                  </Link>
                </div>
              )}

              <div className="pt-4">
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  No credit card required
                </p>
              </div>
            </div>

            {/* App Preview */}
            <div className="flex items-center justify-center">
              <div className="relative h-[530px] w-full max-w-lg">
                <div className="absolute top-0 left-0 h-full w-full rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-20 blur-3xl"></div>
                <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <OptimizedImage
                          src="/PaletteMail/Icon/pltmaild 32px.svg"
                          alt="PaletteMail Icon"
                          width={24}
                          height={24}
                          className="h-6 w-auto mr-2"
                          priority={true}
                        />
                        <h2 className="text-xl font-bold">Email Builder</h2>
                      </div>
                      <div className="flex space-x-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-md border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Template Design</h3>
                        <div className="flex space-x-2">
                          <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-primary"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </div>
                          <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-primary"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border border-gray-200 p-4">
                        <div className="h-8 w-28 rounded-md bg-primary/20 mb-4 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            Header
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-full rounded-md bg-gray-100"></div>
                          <div className="h-4 w-4/5 rounded-md bg-gray-100"></div>
                          <div className="h-4 w-5/6 rounded-md bg-gray-100"></div>
                        </div>
                        <div className="mt-6 h-24 w-full rounded-md bg-gray-100 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8 text-gray-300"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                          </svg>
                        </div>
                        <div className="mt-6 flex justify-center">
                          <div className="h-9 w-32 rounded-md bg-primary/80 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              Read More
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Recipients
                        </label>
                        <div className="h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center px-3">
                          <div className="h-4 w-32 rounded bg-gray-200"></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <div className="h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center px-3">
                          <div className="h-4 w-24 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <div className="h-10 w-28 rounded-md bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          Send Email
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to create amazing emails
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Palette Mail combines powerful features with simplicity to help
              you create and send beautiful emails.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Beautiful Templates</h3>
              <p className="text-gray-600">
                Design emails with an intuitive drag-and-drop editor. Choose
                from a variety of blocks to create personalized, responsive
                emails.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Easy Customization</h3>
              <p className="text-gray-600">
                Personalize every aspect of your emails with custom fonts,
                colors, images, and layouts. Code or No Code. No Problem.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Made by You</h3>
              <p className="text-gray-600">
                Create emails that reflect your unique brand and style. Your
                emails, your way - with professional results every time.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">
                Secure Authentication
              </h3>
              <p className="text-gray-600">
                Protect your account with Palette Mail Authentication for an
                extra layer of security using two-factor authentication.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Email Management</h3>
              <p className="text-gray-600">
                Organize all your email templates in one place. Save, reuse, and
                update your designs whenever you need them.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Scheduled Sending</h3>
              <p className="text-gray-600">
                Plan your email campaigns in advance. Schedule emails to be sent
                at the perfect time for your audience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-100">
              Create your first email template today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href={hasAuthCookie ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-primary hover:bg-gray-50"
              >
                {hasAuthCookie ? "Go to Dashboard" : "Get Started for Free"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
