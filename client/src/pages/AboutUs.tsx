import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Breadcrumbs */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-primary transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">About Us</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              About Us
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              We Always Make The Best
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6 max-w-4xl">
              RescuePlate was born from a simple yet powerful idea: every meal
              deserves a chance. In a world where millions go hungry while tons
              of food are wasted daily, we saw an opportunity to create change.
              We partner with local restaurants, cafes, and food vendors to
              offer their surplus food at discounted prices. This not only helps
              reduce food waste but also makes quality meals accessible to
              everyone while supporting local businesses.
            </p>
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats and Skills Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-white mb-8">Our Skills</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">Sustainability</span>
                    <span className="text-primary font-bold">95%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">Community Building</span>
                    <span className="text-primary font-bold">90%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">Affordability</span>
                    <span className="text-primary font-bold">85%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-8"
            >
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">2+</div>
                <div className="text-gray-300 font-medium">Years Of Experience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">1,000+</div>
                <div className="text-gray-300 font-medium">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-300 font-medium">Meals Rescued</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-300 font-medium">Partner Vendors</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div>
                <div className="text-6xl font-bold text-primary mb-4">1</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Vendors List Food
                </h3>
                <p className="text-gray-300">
                  Restaurants post surplus food items at discounted prices
                  before closing time.
                </p>
              </div>
              <div>
                <div className="text-6xl font-bold text-primary mb-4">2</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Customers Browse
                </h3>
                <p className="text-gray-300">
                  Users discover amazing food deals from local vendors in their
                  area.
                </p>
              </div>
              <div>
                <div className="text-6xl font-bold text-primary mb-4">3</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Pickup & Enjoy
                </h3>
                <p className="text-gray-300">
                  Reserve your meal, pick it up at the specified time, and enjoy
                  quality food at great prices!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              We Are Always Ready To Take A Perfect Shot
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Whether you're a customer looking for great food deals or a vendor
              wanting to reduce waste and reach more customers, RescuePlate is
              here to help. Together, we can make a real difference in our
              communities and our planet.
            </p>
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition text-lg">
              Get Started
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
