import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                About RescuePlate
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fighting food waste, one meal at a time. We connect local
              restaurants with customers to reduce waste and save money.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              RescuePlate was born from a simple yet powerful idea: every meal
              deserves a chance. In a world where millions go hungry while tons
              of food are wasted daily, we saw an opportunity to create change.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We partner with local restaurants, cafes, and food vendors to
              offer their surplus food at discounted prices. This not only helps
              reduce food waste but also makes quality meals accessible to
              everyone while supporting local businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sustainability",
                icon: "🌱",
                description:
                  "We're committed to reducing environmental impact by preventing food from ending up in landfills.",
              },
              {
                title: "Community",
                icon: "🤝",
                description:
                  "Building connections between local businesses and community members who care about making a difference.",
              },
              {
                title: "Affordability",
                icon: "💰",
                description:
                  "Making delicious, quality food accessible to everyone through significant discounts on surplus meals.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-primary/50 transition-all"
              >
                <div className="text-5xl mb-4 text-center">{value.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-300 text-center">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Meals Rescued" },
              { number: "50+", label: "Partner Vendors" },
              { number: "1000+", label: "Happy Customers" },
              { number: "2 tons", label: "Food Waste Prevented" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Vendors List Food",
                description:
                  "Restaurants post surplus food items at discounted prices before closing time.",
              },
              {
                step: "2",
                title: "Customers Browse",
                description:
                  "Users discover amazing food deals from local vendors in their area.",
              },
              {
                step: "3",
                title: "Pickup & Enjoy",
                description:
                  "Reserve your meal, pick it up at the specified time, and enjoy quality food at great prices!",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center mt-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-center">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join the Movement
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Whether you're a customer looking for great food deals or a vendor
              wanting to reduce waste and reach more customers, RescuePlate is
              here to help. Together, we can make a real difference in our
              communities and our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition"
              >
                Get Started Today
              </a>
              <a
                href="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
