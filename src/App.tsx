import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import termsHeroImage from "./assets/terms-hero-travel.jpg";
import indiaPromoImage from "./assets/india-promo-2.png";
import googleRatingImage from "./assets/google.png";
import termsDocumentsImage from "./assets/terms-documents.jpg";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  Facebook,
  Globe2,
  Headphones,
  HelpCircle,
  Instagram,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Plane,
  Printer,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
  X,
  Cloud,
  Compass,
  Anchor,
  Camera,
  Heart,
  Palmtree,
  Mountain,
  Building2,
  Award,
  Users,
  CalendarCheck,
  CreditCard,
  Zap,
  Gift,
  Umbrella,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type TripType = "return" | "one-way";
type Status = "idle" | "loading" | "success" | "error";

type Booking = {
  name: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  departure: string;
  returnDate: string;
  tripType: TripType;
  occupants: string;
  cabin: string;
  notes: string;
  consent: boolean;
};

const heroImageUrl =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Cinematic%20wide%20shot%20of%20a%20modern%20passenger%20airplane%20taking%20off%20at%20golden%20hour%20sunset%2C%20dramatic%20clouds%20with%20orange%20pink%20and%20deep%20blue%20sky%20gradient%2C%20lens%20flare%2C%20holiday%20travel%20mood%2C%20ultra%20realistic%208k%20photography%2C%20movie%20still%2C%20cinematic%20color%20grading%2C%20epic%20atmosphere&image_size=landscape_16_9";

const holidayImages = {
  beach:
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tropical%20beach%20paradise%20with%20crystal%20turquoise%20water%2C%20white%20sand%2C%20palm%20trees%2C%20overwater%20bungalows%2C%20golden%20sunset%20light%2C%20luxury%20holiday%20resort%2C%20cinematic%20travel%20photography%2C%208k&image_size=landscape_16_9",
  mountains:
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Snow%20capped%20alpine%20mountains%20with%20charming%20European%20village%2C%20wooden%20chalets%2C%20dramatic%20clouds%20at%20golden%20hour%2C%20epic%20winter%20travel%20scene%2C%20cinematic%20wide%20angle%20photography%2C%208k&image_size=landscape_16_9",
  city: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Futuristic%20Asian%20skyline%20cityscape%20at%20night%2C%20neon%20lights%2C%20busy%20streets%2C%20temple%20shrine%20in%20foreground%2C%20blends%20old%20and%20new%2C%20cinematic%20blue%20hour%20photography%2C%20ultra%20detailed%208k&image_size=landscape_16_9",
  culture:
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Iconic%20European%20cobblestone%20street%20with%20cafe%20tables%2C%20historic%20architecture%2C%20vibrant%20autumn%20sunlight%2C%20ivy%20covered%20walls%2C%20romantic%20travel%20destination%2C%20cinematic%208k%20photography&image_size=landscape_16_9",
};

const testimonialAvatars = [
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional%20headshot%20portrait%20of%20a%20friendly%20smiling%20middle%20aged%20Indian%20man%20with%20short%20hair%2C%20wearing%20a%20smart%20casual%20shirt%2C%20soft%20studio%20lighting%2C%20neutral%20background%2C%20photorealistic%2C%20high%20detail&image_size=square",
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional%20headshot%20portrait%20of%20a%20happy%20smiling%20Australian%20woman%20in%20her%2030s%20with%20blonde%20hair%2C%20natural%20makeup%2C%20wearing%20casual%20blouse%2C%20soft%20studio%20lighting%2C%20photorealistic%2C%20high%20detail&image_size=square",
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional%20headshot%20portrait%20of%20a%20cheerful%20young%20Vietnamese%20Australian%20man%20smiling%2C%20dark%20hair%2C%20smart%20casual%20outfit%2C%20soft%20natural%20lighting%2C%20photorealistic%2C%20high%20detail&image_size=square",
];

const contactImage =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Friendly%20Australian%20travel%20agent%20team%20working%20at%20modern%20office%20desks%20with%20world%20globes%20and%20holiday%20posters%2C%20warm%20afternoon%20light%20through%20windows%2C%20professional%20welcoming%20atmosphere%2C%20cinematic%20photography%208k&image_size=landscape_4_3";

const holidayPackages = [
  {
    title: "Tropical Escape",
    location: "Fiji · Bali · Maldives",
    price: "From $899pp",
    image: holidayImages.beach,
    icon: Palmtree,
    duration: "5–7 Nights",
  },
  {
    title: "Alpine Adventure",
    location: "Swiss Alps · NZ South",
    price: "From $1,299pp",
    image: holidayImages.mountains,
    icon: Mountain,
    duration: "6–8 Nights",
  },
  {
    title: "Asian Discovery",
    location: "Tokyo · Seoul · HK",
    price: "From $1,099pp",
    image: holidayImages.city,
    icon: Building2,
    duration: "7–10 Nights",
  },
  {
    title: "European Romance",
    location: "Paris · Rome · Prague",
    price: "From $1,599pp",
    image: holidayImages.culture,
    icon: Heart,
    duration: "10–14 Nights",
  },
];

const locations = {
  "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
  Victoria: ["Melbourne", "Geelong"],
  Queensland: ["Brisbane", "Gold Coast", "Cairns"],
  "Western Australia": ["Perth"],
  "South Australia": ["Adelaide"],
  Tasmania: ["Hobart"],
  "Australian Capital Territory": ["Canberra"],
  "Northern Territory": ["Darwin"],
};

const routes = [
  ["Sydney", "Melbourne", "$80 – $250"],
  ["Sydney", "Gold Coast", "$100 – $280"],
  ["Melbourne", "Adelaide", "$90 – $250"],
  ["Brisbane", "Perth", "$150 – $350"],
  ["Cairns", "Sydney", "$120 – $300"],
  ["Melbourne", "Hobart", "$60 – $200"],
];

const terms = [
  [
    "Travel Requirements",
    "Infants are eligible to travel at infant fare rates until they reach 2 years of age. If an infant turns 2 during the journey, the ticket must be reissued at the applicable child fare, and any fare difference, taxes, and airline charges will apply. By submitting payment, you acknowledge and agree to these Terms & Conditions. Passengers are solely responsible for ensuring they hold valid passports, visas, transit visas, and any other travel documentation required by the destination or transit countries. Please verify all travel requirements with the relevant embassy or consulate before departure.",
  ],

  [
    "Airfares & Ticketing",
    "Airfares are not guaranteed until tickets have been issued. Airlines may revise fares, taxes, or surcharges without prior notice before ticket issuance. Once final approval and payment confirmation are received, ticket issuance will be processed within 24–48 hours, subject to payment verification and booking validation by our Accounts Team. Bank transfers should be completed at least 48 hours before the final payment due date, using the booking reference as the payment reference. Airfares, taxes, and airline-imposed charges remain subject to change until the full payment has been received and verified. Completion of payment confirms your acceptance of these Terms & Conditions and our Privacy Policy.",
  ],

  [
    "Schedule & Check-in",
    "Passengers are advised to reconfirm their flight schedule, dates, meal requests, and seat requests 72 hours before departure. Flights Doctor is not responsible for airline schedule changes, delays, or cancellations. In the event of a No-Show or Missed Flight, airline penalties, fare differences, and applicable taxes will apply. Flights Doctor will assist with rebooking where possible; however, all additional costs are the passenger's responsibility. Unless otherwise specified by the airline, tickets are generally valid for 3 months from the date of issue.",
  ],

  [
    "Cancellation & Refund Fees",
    `Cancellation charges can be up to 100% of the booking cost depending on fare rules. Refunds may take approximately 15 weeks or longer depending on the airline. A $200 refund administration fee applies, including in cases of airline schedule changes. Additional no-show fees may apply within 48 hours of departure.

Ticket cost up to $1,000: $175 per ticket.
$1,001 to $2,000: $250 per ticket.
$2,001 to $3,000: $350 per ticket.
Above $3,000: $450 per ticket.`,
  ],

  [
    "Change & Reissue Fees",
    `All non-flexible tickets are non-changeable. If changes are allowed, applicable airline change fees, fare/tax differences and the following administration and consolidation fees may apply.

Ticket cost up to $1,000: $175 per ticket.
$1,001 to $2,000: $250 per ticket.
$2,001 to $3,000: $350 per ticket.
Above $3,000: $450 per ticket.
Domestic tickets: $55 admin and consolidation fee per ticket, plus airline fees and fare/tax differences.`,
  ],

  [
    "Amendments & Refunds",
    "All amendment requests must be submitted via email at least 48 hours before departure and remain subject to airline approval, applicable fare differences, taxes, airline penalties, and Flights Doctor administrative fees. Non-Flexible Tickets cannot be changed, amended, cancelled, or refunded unless otherwise permitted under the airline's fare rules. Flexible Tickets may be changed subject to airline penalties, fare differences, tax differences, and seat availability at the time of the requested change. Refunds, where permitted, are subject to airline approval, applicable penalties, and administrative fees. Refund processing may take approximately 14–16 weeks or longer depending on the airline. Refunds are processed only after the airline has released the funds to Flights Doctor. Processing times are determined by the airline and cannot be guaranteed.",
  ],

  [
    "Passenger Responsibilities",
    "Passengers are responsible for reviewing all passenger names, travel dates, destinations, and flight details before making payment. Flights Doctor accepts no responsibility for errors identified after payment or ticket issuance. Seating, bassinet, wheelchair, meal, and other special service requests are subject to airline availability and are not guaranteed. Passports must remain valid for a minimum of 6 months from the date of travel unless different requirements apply to your destination. Airlines generally do not provide accommodation during transit unless specifically included under their policy or due to operational disruptions. Requests for cabin upgrades (Premium Economy, Business Class, or First Class) should be made before ticket issuance and are subject to airline availability. Passengers must comply with all health, vaccination, testing, and entry requirements imposed by airlines and government authorities at the time of travel.",
  ],

  [
    "Limited Liability",
    "Flights Doctor shall not be liable for delays, cancellations, schedule changes, denied boarding, missed connections, baggage issues, weather disruptions, industrial action, government restrictions, or any circumstances beyond our reasonable control. Flights Doctor is not responsible for services booked independently by passengers, including hotels, transfers, cruises, tours, insurance, or other travel-related products.",
  ],

  [
    "Travel Documentation & Insurance",
    "Passengers are solely responsible for ensuring all passports, visas, permits, vaccination certificates, and other travel documents are valid and available before travel. Flights Doctor accepts no liability for denied boarding or entry resulting from incomplete or incorrect documentation. Flights Doctor strongly recommends that all passengers purchase comprehensive travel insurance covering cancellations, medical emergencies, baggage loss, travel delays, and unforeseen events.",
  ],

  [
    "Payment Disputes",
    "Any payment discrepancy or dispute must be reported within 24 hours of payment. Failure to settle outstanding balances may result in cancellation of the booking.",
  ],

  [
    "Force Majeure",
    "Flights Doctor shall not be liable for any interruption or failure to perform its obligations due to events beyond its control, including but not limited to natural disasters, pandemics, war, terrorism, civil unrest, strikes, government actions, or airline operational disruptions. Flights Doctor is not responsible for travel disruptions arising from changes to immigration laws, border closures, quarantine requirements, or government travel advisories.",
  ],

  [
    "Privacy & Data Protection",
    "Passenger information will be used solely for booking and travel-related purposes and may be shared with airlines, payment providers, and other travel service providers where necessary to complete your booking.",
  ],

  [
    "Special Requirements",
    "Please inform us of any special requirements. All requests are subject to airline confirmation and must be reconfirmed with us at least three business days before departure. Requests are not guaranteed. Some airlines may charge additional fees. If an infant turns two years old during travel, child fare and reissue fees will apply for onward, return, or both journeys. It is your responsibility to notify us of such changes. Children traveling with relatives/guardians may require written consent from both parents. Please check with the airline and relevant authorities. A minor must be accompanied by their natural parents at all times. No airline provides transit accommodation.",
  ],

  [
    "Passports and Visas",
    "You are responsible for ensuring that your passport, visas, transit visas, and re-entry permits are valid and meet all immigration and government authority requirements. Any fines or costs due to improper documentation are your sole responsibility. Most countries require passports to be valid for at least six months from entry. Contact the appropriate consulate for visa requirements.",
  ],
];

const banks = [
  { name: "CBA", bsb: "062 692", acc: "4931 6037" },
  { name: "ANZ", bsb: "012 055", acc: "1559 54159" },
  { name: "NAB", bsb: "082 356", acc: "2732 63156" },
];

const stats = [
  ["15K+", "Happy travellers", Users, "#004AAD"],
  ["500+", "Routes covered", Globe2, "#1075CF"],
  ["ATAS", "ATAS Certification", BadgeCheck, "#41A3D8"],
  ["4.9★", "Customer rating", Award, "#E00000"],
];

const steps = [
  [
    Plane,
    "Tell us your plans",
    "Share your route, dates and preferences through our quick booking form.",
  ],
  [
    WalletCards,
    "Get a tailored quote",
    "Our team compares fares and finds the best value for your journey.",
  ],
  [
    BadgeCheck,
    "Confirm & fly",
    "Approve your quote, complete payment, and receive your ticket within 24–48 hours.",
  ],
];

const testimonials = [
  [
    "Ravi Sharma",
    "Sydney → Delhi",
    "Flights Doctor found me a fare $400 cheaper than anything I saw online. The team was patient and thorough.",
    testimonialAvatars[0],
  ],
  [
    "Sarah Williams",
    "Melbourne → Singapore",
    "Booked a complex family trip with stopovers effortlessly. They handled every detail.",
    testimonialAvatars[1],
  ],
  [
    "James Nguyen",
    "Brisbane → Ho Chi Minh",
    "Great service and honest advice. They rebooked my cancelled flight without any hassle.",
    testimonialAvatars[2],
  ],
];

const faqs = [
  [
    "How quickly will I receive my ticket?",
    "Once payment is confirmed, tickets are typically issued within 24–48 hours, subject to airline verification.",
  ],
  [
    "Can I change my booking after payment?",
    "Amendment requests must be emailed at least 48 hours before departure. Changes depend on the airline fare rules and may attract fees.",
  ],
  [
    "What happens if I miss my flight?",
    "Airline penalties and fare differences will apply. We will assist with rebooking wherever possible, but additional costs are your responsibility.",
  ],
  [
    "How long do refunds take?",
    "Refunds can take approximately 14–16 weeks or longer, depending on the airline. We process them only after the airline releases the funds.",
  ],
  [
    "Do I need travel insurance?",
    "We strongly recommend comprehensive travel insurance for all passengers to cover cancellations, medical emergencies and unforeseen events.",
  ],
];

const initialBooking: Booking = {
  name: "",
  email: "",
  phone: "",
  from: "Sydney",
  to: "Melbourne",
  departure: "",
  returnDate: "",
  tripType: "return",
  occupants: "1",
  cabin: "Economy",
  notes: "",
  consent: false,
};

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimatedCounter({
  value,
  delay = 0,
}: {
  value: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) {
      setDisplay(value);
      return;
    }
    const num = parseFloat(numMatch[0]);
    const suffix = value.replace(numMatch[0], "");
    let frame = 0;
    const totalFrames = 60;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(num * eased * 10) / 10;
        setDisplay(
          (Number.isInteger(current)
            ? current.toFixed(0)
            : current.toFixed(1)) + suffix,
        );
        if (frame >= totalFrames) {
          setDisplay(value);
          clearInterval(interval);
        }
      }, 20);
    }, delay * 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isInView, value, delay]);

  return <span ref={ref}>{display}</span>;
}

function FloatingParticles({
  count = 30,
  colors = true,
}: {
  count?: number;
  colors?: boolean;
}) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 6 + Math.random() * 12,
    delay: Math.random() * 8,
    size: 2 + Math.random() * 7,
    opacity: 0.1 + Math.random() * 0.45,
    seed: Math.random(),
  }));

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background:
              colors && p.seed < 0.33
                ? "linear-gradient(135deg, #ffffff, #E00000)"
                : colors && p.seed < 0.66
                  ? "linear-gradient(135deg, #ffffff, #41A3D8)"
                  : "linear-gradient(135deg, #ffffff, #004AAD)",
          }}
          animate={{
            y: [0, -70 - p.seed * 30, 0],
            x: [0, 20 + p.seed * 30, -10, 0],
            opacity: [p.opacity, p.opacity + 0.35, p.opacity],
            scale: [1, 1.4 + p.seed * 0.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedClouds() {
  return (
    <div className="clouds-container">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="cloud-layer"
          style={{ top: `${8 + i * 17}%` }}
          animate={{
            x: ["-100%", "200vw"],
            opacity: [0.07, 0.16, 0.07],
          }}
          transition={{
            duration: 70 + i * 22,
            delay: i * 9,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Cloud className="cloud-icon" size={70 + i * 32} strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  );
}

function Logo({ className = "" }: { className?: string }) {
  const [hoverCount, setHoverCount] = useState(0);

  const handleMouseEnter = () => {
    setHoverCount((prev) => prev + 1);
  };

  const isBlue = hoverCount % 2 === 1;

  return (
    <motion.a
      className={`logo ${isBlue ? "logo-hover-blue" : "logo-hover-red"}`}
      href="#top"
      aria-label="Flights Doctor home"
      onMouseEnter={handleMouseEnter}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src="/Flights_Doctor_Logo_.png"
        alt="Flights Doctor - Your Comfort Our Duty"
        className={`site-logo ${className}`.trim()}
      />
    </motion.a>
  );
}

function GradientOrbs({ accent = true }: { accent?: boolean }) {
  return (
    <div className="gradient-orbs">
      <motion.div
        className="orb orb-red"
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 35, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-blue"
        animate={{
          scale: [1, 1.35, 1],
          x: [0, -45, 0],
          y: [0, 35, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
      {accent && (
        <motion.div
          className="orb orb-sky"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 25, -35, 0],
            y: [0, -45, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
        />
      )}
    </div>
  );
}

function TiltCard({
  children,
  className = "",
  depth = 30,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [13, -13]), {
    stiffness: 170,
    damping: 17,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-13, 13]), {
    stiffness: 170,
    damping: 17,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: `translateZ(${depth}px)` }}>{children}</div>
    </motion.div>
  );
}

function CinematicScene({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div
      className={`relative cinematic-bars overflow-hidden ${id ? "" : ""}`}
      id={id}
    >
      <div className="film-grain" />
      {children}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [page, setPage] = useState<"home" | "terms" | "contact">(
    window.location.pathname === "/terms"
      ? "terms"
      : window.location.pathname === "/contact"
        ? "contact"
        : "home",
  );
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroZoom = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["scale(1)", "scale(1.08)"],
  );

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 36);
    const onPop = () =>
      setPage(
        window.location.pathname === "/terms"
          ? "terms"
          : window.location.pathname === "/contact"
            ? "contact"
            : "home",
      );
    window.addEventListener("scroll", onScroll);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              el,
              { y: 70, opacity: 0, rotationX: 8 },
              {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 1,
                ease: "power3.out",
                delay: i * 0.09,
              },
            );
          },
          once: true,
        });
      });

      gsap.utils.toArray<HTMLElement>(".parallax-bg").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
          onUpdate: (self) => {
            gsap.set(el, {
              y: self.progress * -100,
              scale: 1 + self.progress * 0.08,
            });
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".kenburns").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
          onUpdate: (self) => {
            gsap.set(el, {
              scale: 1.05 + self.progress * 0.12,
              x: -30 + self.progress * 60,
              y: -20 + self.progress * 40,
            });
          },
        });
      });
    });
    return () => ctx.revert();
  }, [page]);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const updateBooking = (key: keyof Booking, value: string | boolean) =>
    setBooking((current) => ({ ...current, [key]: value }));
  const goTo = (path: string) => {
    window.history.pushState({}, "", path);
    setPage(
      path === "/terms" ? "terms" : path === "/contact" ? "contact" : "home",
    );
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    if (
      !booking.name.trim() ||
      !booking.email.trim() ||
      !booking.phone.trim() ||
      !booking.departure ||
      !booking.consent
    )
      return "Please complete the required fields and accept the terms.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email))
      return "Please enter a valid email address.";
    if (
      booking.tripType === "return" &&
      (!booking.returnDate || booking.returnDate < booking.departure)
    )
      return "Your return date must be on or after your departure date.";
    return "";
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      setFormError(error);
      setStatus("error");
      return;
    }
    setFormError("");
    setStatus("loading");
    const payload = {
      ...booking,
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
      subject: "Flight Request from Website",
      to: "info@flightsdoctor.com.au",
      botcheck: "",
    };
    try {
      if (!payload.access_key)
        throw new Error("Form endpoint is not configured");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Unable to submit");
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setFormError(
        "We could not send the request online. You can still email your details directly below.",
      );
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 40, scale: 0.985, filter: "blur(12px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -40, scale: 0.985, filter: "blur(10px)" },
  };

  if (page === "terms")
    return (
      <>
        <Header
          compact={compact}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          goTo={goTo}
          solid
        />
        <AnimatePresence mode="wait">
          <motion.div
            key="terms"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <Terms />
          </motion.div>
        </AnimatePresence>
      </>
    );
  if (page === "contact")
    return (
      <>
        <Header
          compact={compact}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          goTo={goTo}
          solid
        />
        <AnimatePresence mode="wait">
          <motion.div
            key="contact"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <ContactPage goTo={goTo} />
          </motion.div>
        </AnimatePresence>
      </>
    );

  return (
    <div id="top">
      <Header
        compact={compact}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        goTo={goTo}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <main>
            <CinematicScene>
              <motion.section
                className="hero"
                style={{ y: backgroundY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className="hero-image kenburns"
                  style={{
                    backgroundImage: `url(${heroImageUrl})`,
                    scale: heroZoom,
                  }}
                />
                <div className="hero-shade" />
                <div className="cinematic-vignette" />
                <GradientOrbs accent />
                <AnimatedClouds />
                <FloatingParticles count={40} />

                <motion.div
                  className="hero-plane-trailing"
                  initial={{ x: "-25vw", y: "25vh", opacity: 0, rotate: -14 }}
                  animate={{
                    x: ["-25vw", "25vw", "130vw"],
                    y: ["25vh", "-2vh", "-18vh"],
                    opacity: [0, 0.4, 0],
                    rotate: -14,
                  }}
                  transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 3,
                  }}
                >
                  <Plane size={54} strokeWidth={1.5} />
                  <span className="trail" />
                </motion.div>

                <motion.div
                  className="hero-plane-trailing"
                  style={{ top: "38%", left: 0 }}
                  initial={{ x: "130vw", y: 0, opacity: 0, rotate: 160 }}
                  animate={{
                    x: ["130vw", "35vw", "-30vw"],
                    y: [0, "8vh", "15vh"],
                    opacity: [0, 0.25, 0],
                    rotate: 160,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 11,
                  }}
                >
                  <Plane size={36} strokeWidth={1.5} />
                </motion.div>

                <div className="hero-inner">
                  <IndiaFarePromo />

                  <BookingForm
                    booking={booking}
                    updateBooking={updateBooking}
                    submitBooking={submitBooking}
                    today={today}
                    status={status}
                    formError={formError}
                    goTo={goTo}
                  />
                </div>

                <motion.div
                  className="scroll-indicator"
                  animate={{ y: [0, 14, 0], opacity: 1 }}
                  transition={{
                    y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                    opacity: { delay: 1.7 },
                  }}
                  initial={{ opacity: 0 }}
                >
                  <ChevronDown size={24} />
                </motion.div>
              </motion.section>
            </CinematicScene>

            <StatsBar />
            <HolidayPackages />
            <Features />
            <Routes
              onRequest={(from, to) => {
                updateBooking("from", from);
                updateBooking("to", to);
                document
                  .getElementById("booking")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />
            <HowItWorks />
            <Faq />
            <Testimonials />
            <Callout goTo={goTo} />
          </main>
          <Footer goTo={goTo} />
        </motion.div>
      </AnimatePresence>
      <div className="action-dock">
        <a
          className="dock-btn dock-whatsapp"
          href="https://wa.me/61406337900"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <span className="dock-icon">
            <svg
              viewBox="0 0 32 32"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16.04 4C9.4 4 4 9.36 4 15.96c0 2.1.56 4.14 1.63 5.96L4 28l6.3-1.62a12.1 12.1 0 0 0 5.74 1.44h.01c6.63 0 12.03-5.36 12.03-11.96 0-3.2-1.26-6.2-3.53-8.46A12.02 12.02 0 0 0 16.04 4Zm0 21.9h-.01a10 10 0 0 1-5.1-1.4l-.37-.22-3.74.96 1-3.64-.24-.38a9.86 9.86 0 0 1-1.53-5.26c0-5.45 4.47-9.88 9.99-9.88 2.67 0 5.18 1.03 7.07 2.9a9.8 9.8 0 0 1 2.93 7c0 5.45-4.47 9.92-10 9.92Zm5.5-7.42c-.3-.15-1.78-.87-2.06-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.48-.9-.79-1.5-1.77-1.68-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
            </svg>
          </span>
          <span className="dock-label">WhatsApp</span>
        </a>
        <a
          className="dock-btn dock-call"
          href="tel:0287597722"
          aria-label="Call now"
        >
          <span className="dock-icon">
            <Phone size={18} strokeWidth={2.4} />
          </span>
          <span className="dock-label">Call Now</span>
        </a>
      </div>
    </div>
  );
}

function Header({
  compact,
  menuOpen,
  setMenuOpen,
  goTo,
  solid,
}: {
  compact: boolean;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  goTo: (path: string) => void;
  solid?: boolean;
}) {
  return (
    <motion.header
      className={`site-header ${compact ? "compact" : ""} ${solid ? "solid" : ""}`}
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-wrap">
        <Logo className="navbar-logo" />
        <nav className={menuOpen ? "open" : ""}>
          {[
            { label: "Home", onClick: () => goTo("/") },
            {
              label: "Packages",
              href: "#packages",
              onClick: () => setMenuOpen(false),
            },
            {
              label: "Domestic flights",
              href: "#routes",
              onClick: () => setMenuOpen(false),
            },
            {
              label: "Why us",
              href: "#why-us",
              onClick: () => setMenuOpen(false),
            },
            { label: "FAQ", href: "#faq", onClick: () => setMenuOpen(false) },
            { label: "Terms", onClick: () => goTo("/terms") },
            {
              label: "Contact",
              onClick: () => goTo("/contact"),
              className: "mobile-link",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05, duration: 0.5 }}
            >
              {!item.href ? (
                <button onClick={item.onClick} className={item.className}>
                  {item.label}
                </button>
              ) : (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className={item.className}
                >
                  {item.label}
                </a>
              )}
            </motion.div>
          ))}
        </nav>
        <motion.a
          className="nav-cta"
          href="tel:0287597722"
          whileHover={{ scale: 1.08, boxShadow: "0 0 30px rgba(224,0,0,0.55)" }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 160 }}
        >
          <Headphones size={17} /> Talk to an expert
        </motion.a>
        <motion.button
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.88 }}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -120, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 120, opacity: 0 }}
                transition={{ duration: 0.35, type: "spring" }}
              >
                <X />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 120, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -120, opacity: 0 }}
                transition={{ duration: 0.35, type: "spring" }}
              >
                <Menu />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.header>
  );
}

function BookingForm({
  booking,
  updateBooking,
  submitBooking,
  today,
  status,
  formError,
  goTo,
}: {
  booking: Booking;
  updateBooking: (key: keyof Booking, value: string | boolean) => void;
  submitBooking: (event: FormEvent<HTMLFormElement>) => void;
  today: string;
  status: Status;
  formError: string;
  goTo: (path: string) => void;
}) {
  return (
    <motion.section
      className="booking-card"
      id="booking"
      initial={{ opacity: 0, x: 100, rotateY: -22, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1500 }}
      whileHover={{
        y: -12,
        rotateX: -2,
        boxShadow: "0 55px 110px rgba(8,48,103,0.38)",
      }}
    >
      <div className="card-glow" />
      <div className="card-heading">
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
          >
            <span /> Start your journey
          </motion.p>
          <h2>
            <span className="gradient-text">Find your best way there.</span>
          </h2>
        </div>
        <motion.div
          animate={{
            x: [0, 12, 0],
            rotate: [-14, -6, -14],
            y: [0, -6, 0],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plane className="heading-plane" size={28} strokeWidth={1.8} />
        </motion.div>
      </div>
      <form onSubmit={submitBooking} noValidate>
        <div className="form-grid two">
          <motion.label
            whileFocus={{ scale: 1.012 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            Name
            <input
              value={booking.name}
              onChange={(e) => updateBooking("name", e.target.value)}
              placeholder="Your full name"
            />
            <span className="input-shine" />
          </motion.label>
          <motion.label
            whileFocus={{ scale: 1.012 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            Email
            <input
              type="email"
              value={booking.email}
              onChange={(e) => updateBooking("email", e.target.value)}
              placeholder="you@email.com"
            />
            <span className="input-shine" />
          </motion.label>
        </div>
        <motion.label
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
        >
          Phone number
          <input
            type="tel"
            value={booking.phone}
            onChange={(e) => updateBooking("phone", e.target.value)}
            placeholder="04XX XXX XXX"
          />
          <span className="input-shine" />
        </motion.label>
        <div className="trip-switch">
          <span>Trip type</span>
          {[
            { type: "return", label: "Return", icon: ArrowRight },
            { type: "one-way", label: "One way", icon: ArrowUpRight },
          ].map((t, i) => (
            <motion.label
              key={t.type}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 + i * 0.06, type: "spring" }}
            >
              <input
                type="radio"
                checked={booking.tripType === t.type}
                onChange={() => updateBooking("tripType", t.type as TripType)}
              />
              <span className="radio-custom" />
              <t.icon size={14} /> {t.label}
            </motion.label>
          ))}
        </div>
        <div className="form-grid two">
          <Select
            label="Leaving from"
            value={booking.from}
            onChange={(value) => updateBooking("from", value)}
            icon={<Plane size={14} className="rotate-45" />}
          />
          <Select
            label="Going to"
            value={booking.to}
            onChange={(value) => updateBooking("to", value)}
            icon={<Anchor size={14} />}
          />
        </div>
        <div className="form-grid two">
          <motion.label
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring" }}
          >
            Departure
            <input
              type="date"
              min={today}
              value={booking.departure}
              onChange={(e) => updateBooking("departure", e.target.value)}
            />
            <span className="input-shine" />
          </motion.label>
          <AnimatePresence mode="wait">
            {booking.tripType === "return" && (
              <motion.label
                key="return"
                initial={{ opacity: 0, scale: 0.8, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: "auto" }}
                exit={{ opacity: 0, scale: 0.8, height: 0 }}
                transition={{ duration: 0.35, type: "spring", stiffness: 120 }}
                whileFocus={{ scale: 1.01 }}
              >
                Return
                <input
                  type="date"
                  min={booking.departure || today}
                  value={booking.returnDate}
                  onChange={(e) => updateBooking("returnDate", e.target.value)}
                />
                <span className="input-shine" />
              </motion.label>
            )}
          </AnimatePresence>
        </div>
        {/* <div className="form-grid two">
          <Select label="Travellers" value={booking.occupants} onChange={(value) => updateBooking('occupants', value)} options={['1', '2', '3', '4+']} icon={<Users size={14} />} />
          <Select label="Cabin class" value={booking.cabin} onChange={(value) => updateBooking('cabin', value)} options={['Economy', 'Premium Economy', 'Business', 'First']} icon={<CreditCard size={14} />} />
        </div> */}
        <motion.label
          whileFocus={{ scale: 1.005 }}
          transition={{ type: "spring" }}
        >
          {/* Notes <span className="optional">optional</span>
          <textarea rows={2} value={booking.notes} onChange={(e) => updateBooking('notes', e.target.value)} placeholder="Anything we should know? Stopovers, seating, preferences…" /> */}
        </motion.label>
        <label className="consent">
          <input
            type="checkbox"
            checked={booking.consent}
            onChange={(e) => updateBooking("consent", e.target.checked)}
          />
          <span className="checkbox-custom" />
          <span>
            I accept the{" "}
            <button type="button" onClick={() => goTo("/terms")}>
              Terms & Conditions
            </button>{" "}
            and Privacy Policy.
          </span>
        </label>
        <AnimatePresence>
          {formError && (
            <motion.p
              className="form-message error"
              initial={{ opacity: 0, y: -14, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -14, height: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {formError}{" "}
              {status === "error" && (
                <a
                  href={`mailto:info@flightsdoctor.com.au?subject=Flight%20Request%20from%20Website&body=${encodeURIComponent(JSON.stringify(booking, null, 2))}`}
                >
                  Email us instead
                </a>
              )}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              className="form-message success"
              initial={{ opacity: 0, scale: 0.9, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <motion.div
                animate={{ scale: [0, 1.3, 1], rotate: [0, 360] }}
                transition={{ duration: 0.7 }}
              >
                <Check size={18} />
              </motion.div>
              Request received. Our team will be in touch shortly.
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          disabled={status === "loading"}
          className="button button-primary full"
          type="submit"
          whileHover={
            status !== "loading"
              ? { scale: 1.03, boxShadow: "0 20px 50px rgba(224,0,0,0.55)" }
              : {}
          }
          whileTap={status !== "loading" ? { scale: 0.98 } : {}}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Sending request…
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Zap size={15} /> Request flight details <Send size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.p
          className="secure-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.25 }}
        >
          <ShieldCheck size={14} /> No obligation. We reply during business
          hours.
        </motion.p>
      </form>
    </motion.section>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  icon?: React.ReactNode;
}) {
  const values = options || Object.values(locations).flat();
  return (
    <motion.label
      whileFocus={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      {icon && <span className="select-icon">{icon}</span>}
      {label}
      <span className="select-wrap">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options
            ? values.map((option) => <option key={option}>{option}</option>)
            : Object.entries(locations).map(([state, cities]) => (
                <optgroup key={state} label={state}>
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </optgroup>
              ))}
        </select>
        <ChevronDown size={16} />
        <span className="input-shine" />
      </span>
    </motion.label>
  );
}

function StatsBar() {
  const ref = useReveal();
  return (
    <motion.section
      className="stats-bar reveal gsap-reveal"
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
    >
      {stats.map(([figure, label, Icon, color], i) => (
        <motion.div
          key={figure as string}
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: i * 0.15,
            duration: 0.8,
            type: "spring",
            stiffness: 110,
          }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <motion.div
            className="mb-3 inline-grid place-items-center w-11 h-11 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${color as string}22, ${color as string}15)`,
              color: color as string,
              boxShadow: `0 6px 18px ${color as string}30`,
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            <Icon size={20} />
          </motion.div>
          <strong>
            <AnimatedCounter value={figure as string} delay={i * 0.15} />
          </strong>
          <span>{label as string}</span>
        </motion.div>
      ))}
    </motion.section>
  );
}

function IndiaFarePromo() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const glowX = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  return (
    <motion.section
      className="india-promo"
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="india-promo-card">
        <motion.div
          className="india-promo-bg"
          style={{ y: bgY, backgroundImage: `url(${indiaPromoImage})` }}
        />
        <div className="india-promo-overlay" />
        <motion.div className="india-promo-glow" style={{ x: glowX }} />
        <img
          src={googleRatingImage}
          alt="Google Rating 4.9"
          className="india-promo-google-rating"
        />
        <motion.div
          className="india-promo-plane"
          animate={{ left: ["-14%", "104%"], y: [0, -16, 0, -10, 0] }}
          transition={{
            left: { duration: 16, repeat: Infinity, ease: "linear" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="plane-trail" />
          <span className="plane-icon">
            <Plane size={24} strokeWidth={1.8} />
          </span>
        </motion.div>
        <div className="india-promo-content">
          <motion.p
            className="eyebrow light"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <span />
            Fare drop · Limited seats
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
          >
            Australia to India
            <br />
            from <strong className="india-promo-price">$479</strong>
          </motion.h2>
          <motion.p
            className="india-promo-text"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            Return fares ex-Sydney, Melbourne &amp; Brisbane to Delhi, Mumbai,
            Amritsar and more — taxes included, curated by our experts.
          </motion.p>
          <motion.div
            className="india-promo-chips"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.52 }}
          >
            {["Delhi", "Mumbai", "Amritsar", "Bengaluru"].map((city) => (
              <span key={city} className="india-promo-chip">
                {city}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function HolidayPackages() {
  const ref = useReveal();
  return (
    <section
      className="features reveal"
      id="packages"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <motion.div
        className="section-label"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Gift size={14} /> Hand-picked holiday packages
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12 max-w-3xl mx-auto"
      >
        <h2
          style={{
            color: "#083067",
            fontSize: "clamp(30px, 4vw, 50px)",
            letterSpacing: "-1.5px",
            fontWeight: 800,
          }}
        >
          Dream getaways,
          <br />
          <span className="gradient-text">crafted by experts.</span>
        </h2>
        <p
          style={{
            color: "#5a7490",
            marginTop: 18,
            lineHeight: 1.8,
            fontSize: 15,
          }}
        >
          From tropical beach escapes to alpine adventures and European city
          romance — our curated packages bundle flights, stays and experiences.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {holidayPackages.map((pkg, i) => (
          <motion.div
            key={pkg.title}
            initial={{ opacity: 0, y: 70, rotateY: i % 2 === 0 ? -15 : 15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: i * 0.13,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <TiltCard className="h-full" depth={36}>
              <article
                className="h-full rounded-2xl overflow-hidden bg-white border border-neutral-mid shadow-lg"
                style={{
                  borderColor: "#E5E8EF",
                  boxShadow: "0 14px 40px rgba(8,48,103,0.08)",
                }}
              >
                <div className="relative h-52 overflow-hidden">
                  <motion.img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.18 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    initial={{ scale: 1.05 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#083067]/80 via-[#083067]/20 to-transparent" />
                  <motion.div
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(224,0,0,0.95), rgba(204,0,0,0.9))",
                      boxShadow: "0 6px 18px rgba(224,0,0,0.35)",
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Zap size={12} /> Best Value
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5"
                    style={{
                      background: "rgba(8,48,103,0.75)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Clock3 size={12} /> {pkg.duration}
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full grid place-items-center text-white"
                    style={{
                      background: "linear-gradient(135deg, #004AAD, #1075CF)",
                      boxShadow: "0 6px 18px rgba(0,74,173,0.4)",
                    }}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={16} fill="white" />
                  </motion.div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-8 h-8 rounded-lg grid place-items-center text-white"
                      style={{
                        background: "linear-gradient(135deg, #004AAD, #1075CF)",
                      }}
                    >
                      <pkg.icon size={14} />
                    </span>
                    <h3
                      style={{
                        color: "#083067",
                        fontWeight: 800,
                        fontSize: 19,
                        letterSpacing: "-.4px",
                        margin: 0,
                      }}
                    >
                      {pkg.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      color: "#5a7490",
                      fontSize: 12.5,
                      marginBottom: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <MapPin size={13} /> {pkg.location}
                  </p>
                  <div
                    className="flex items-end justify-between pt-3 border-t"
                    style={{ borderColor: "#E5E8EF" }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#7e8fa4",
                          textTransform: "uppercase",
                          letterSpacing: ".5px",
                          fontWeight: 700,
                        }}
                      >
                        Starting
                      </div>
                      <div
                        style={{
                          fontSize: 21,
                          fontWeight: 800,
                          color: "#E00000",
                          fontFamily: "Manrope, sans-serif",
                          letterSpacing: "-.4px",
                        }}
                      >
                        {pkg.price}
                      </div>
                    </div>
                    <motion.button
                      className="button button-blue"
                      style={{
                        minHeight: 40,
                        padding: "0 16px",
                        fontSize: 10.5,
                        borderRadius: 10,
                      }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        document
                          .getElementById("booking")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <Camera size={12} /> Enquire
                    </motion.button>
                  </div>
                </div>
              </article>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    [
      WalletCards,
      "Better value",
      "We compare every detail, not just the headline fare, to find a trip that truly fits.",
      "#004AAD",
    ],
    [
      Globe2,
      "Local knowledge",
      "From quick getaways to complex itineraries, our advice is always genuinely human.",
      "#1075CF",
    ],
    [
      Umbrella,
      "Protected trips",
      "ATAS accredited, insured and backed by 24/7 contingency support you can trust.",
      "#E00000",
    ],
  ];
  const ref = useReveal();
  return (
    <section
      className="features reveal"
      id="why-us"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <motion.div
        className="section-label"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        The Flights Doctor difference
      </motion.div>
      <div className="feature-grid">
        {items.map(([Icon, title, copy, color], i) => (
          <motion.div
            key={title as string}
            initial={{ opacity: 0, y: 70, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: i * 0.22,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <TiltCard depth={34}>
              <article className="feature">
                <motion.span
                  className="feature-icon"
                  whileHover={{ scale: 1.18, rotate: 8 }}
                  animate={{
                    boxShadow: [
                      `0 0 0 ${color as string}00`,
                      `0 0 35px ${color as string}55`,
                      `0 0 0 ${color as string}00`,
                    ],
                  }}
                  transition={{
                    boxShadow: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    },
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${color as string}14, ${color as string}0d)`,
                    color: color as string,
                  }}
                >
                  <Icon size={22} />
                </motion.span>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex" style={{ gap: 3, color: "#FFB800" }}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <span
                    style={{ fontSize: 11, color: "#7e8fa4", fontWeight: 600 }}
                  >
                    Expert verified
                  </span>
                </div>
                <h3>{title as string}</h3>
                <p>{copy as string}</p>
              </article>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Routes({
  onRequest,
}: {
  onRequest: (from: string, to: string) => void;
}) {
  const ref = useReveal();
  return (
    <section
      className="routes-section reveal"
      id="routes"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="routes-bg-pattern" />
      <div className="section-intro">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow">
            <span /> Popular domestic routes
          </p>
          <h2>
            Go where the good
            <br />
            <em>stories begin.</em>
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Indicative domestic fares, updated regularly. Ask our team about
          international flights, multi-stop itineraries and bespoke holidays.
        </motion.p>
      </div>
      <div className="route-list">
        {routes.map(([from, to, price], i) => (
          <motion.article
            className="route-card gsap-reveal"
            key={`${from}-${to}`}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.12, duration: 0.7 }}
            whileHover={{
              y: -12,
              x: 6,
              scale: 1.018,
              boxShadow: "0 38px 72px rgba(8,48,103,0.18)",
            }}
          >
            <div className="route-line">
              <div className="flex flex-col items-start">
                <span
                  style={{
                    fontSize: 10,
                    color: "#7e8fa4",
                    fontWeight: 700,
                    letterSpacing: ".6px",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  From
                </span>
                <strong>{from}</strong>
              </div>
              <div className="route-anim-line">
                <span className="route-dot" />
                <span className="route-track" />
                <motion.span
                  className="route-plane-moving"
                  animate={{ left: ["0%", "100%"] }}
                  transition={{
                    duration: 3.5 + i * 0.4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.35,
                  }}
                >
                  <Plane size={16} strokeWidth={1.8} />
                </motion.span>
                <span className="route-track" />
                <span className="route-dot filled" />
              </div>
              <div className="flex flex-col items-end">
                <span
                  style={{
                    fontSize: 10,
                    color: "#7e8fa4",
                    fontWeight: 700,
                    letterSpacing: ".6px",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  To
                </span>
                <strong>{to}</strong>
              </div>
            </div>
            <div className="price-block">
              <div>
                <small>from</small>
                <motion.strong
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="gradient-text-strong"
                >
                  {price}
                </motion.strong>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span
                  style={{ fontSize: 10.5, color: "#7e8fa4", fontWeight: 600 }}
                >
                  <span
                    className="inline-block"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#10B981",
                      marginRight: 6,
                      boxShadow: "0 0 8px rgba(16,185,129,0.5)",
                    }}
                  />
                  Direct
                </span>
              </div>
              <motion.button
                onClick={() => onRequest(from as string, to as string)}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 14px 36px rgba(224,0,0,0.5)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                Request details
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowUpRight size={15} />
                </motion.span>
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useReveal();
  return (
    <section
      className="how-it-works reveal"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <motion.div
        className="section-label"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        How it works
      </motion.div>
      <div className="steps-grid">
        {steps.map(([Icon, title, copy], index) => (
          <motion.div
            key={title as string}
            initial={{
              opacity: 0,
              y: 80,
              rotateY: index === 1 ? 0 : index === 0 ? -25 : 25,
            }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: index * 0.25,
              duration: 0.95,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <TiltCard className="h-full" depth={38}>
              <article className="step-card h-full">
                <motion.span
                  className="step-number"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    delay: index * 0.4,
                  }}
                >
                  0{index + 1}
                </motion.span>
                <motion.span
                  className="step-icon"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.25,
                    },
                    scale: { duration: 0.6, type: "spring" },
                    rotate: { duration: 0.6, type: "spring" },
                  }}
                >
                  <Icon size={25} strokeWidth={1.8} />
                </motion.span>
                <h3>{title as string}</h3>
                <p>{copy as string}</p>
                {index < steps.length - 1 && (
                  <motion.div
                    className="step-arrow-wrap"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.25 + 0.6,
                      type: "spring",
                      stiffness: 150,
                    }}
                  >
                    <motion.div
                      animate={{ x: [0, 7, 0] }}
                      transition={{
                        duration: 1.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight size={20} strokeWidth={2} />
                    </motion.div>
                  </motion.div>
                )}
              </article>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const ref = useReveal();
  return (
    <section
      className="testimonials reveal gsap-reveal"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="testimonials-bg" />
      <FloatingParticles count={20} colors />
      <motion.div
        className="section-label light"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Star size={14} fill="currentColor" /> What travellers say
      </motion.div>
      <div className="testimonial-grid">
        {testimonials.map(([name, route, quote, avatar], i) => (
          <motion.article
            className="testimonial-card"
            key={name as string}
            initial={{ opacity: 0, y: 60, scale: 0.94, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: i * 0.18,
              duration: 0.8,
              type: "spring",
              stiffness: 110,
              damping: 18,
            }}
            whileHover={{
              y: -16,
              scale: 1.025,
              rotateX: -4,
              boxShadow: "0 55px 100px -20px rgba(0,0,0,0.55)",
            }}
            style={{ transformPerspective: 1200 }}
          >
            <motion.div
              animate={{ rotate: [0, -5, 0], x: [0, 3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Quote className="quote-mark" size={30} strokeWidth={1.5} />
            </motion.div>
            <div className="stars">
              {[...Array(5)].map((_, j) => (
                <motion.span
                  key={j}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.18 + 0.12 + j * 0.07,
                    type: "spring",
                    stiffness: 320,
                    damping: 18,
                  }}
                >
                  <Star size={15} fill="currentColor" />
                </motion.span>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18 + 0.5 }}
            >
              "{quote as string}"
            </motion.p>
            <motion.div
              className="testimonial-author"
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18 + 0.65, type: "spring" }}
            >
              <motion.img
                src={avatar as string}
                alt={name as string}
                className="testimonial-avatar"
                loading="lazy"
                whileHover={{ scale: 1.12, rotate: 4 }}
                animate={{
                  boxShadow: [
                    "0 8px 24px rgba(0,0,0,0.3)",
                    "0 0 0 4px rgba(255,138,92,0.35), 0 8px 24px rgba(0,0,0,0.3)",
                    "0 8px 24px rgba(0,0,0,0.3)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  },
                }}
              />
              <div>
                <strong>{name as string}</strong>
                <span className="flex items-center gap-1.5">
                  <Compass size={12} /> {route as string}
                </span>
              </div>
            </motion.div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useReveal();
  return (
    <section
      className="faq-section reveal"
      id="faq"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="faq-inner">
        <motion.div
          className="faq-intro"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <p className="eyebrow">
            <span /> Good to know
          </p>
          <h2>
            Questions,
            <br />
            <span className="gradient-text">answered.</span>
          </h2>
          <p>
            Everything you need to know before booking with us. Can't find your
            answer? Our team is one call away — 7 days a week.
          </p>
          <div className="flex flex-col gap-3">
            <motion.a
              className="button button-primary w-fit"
              href="tel:0287597722"
              whileHover={{
                scale: 1.06,
                boxShadow: "0 18px 42px rgba(224,0,0,0.5)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Phone size={16} /> Call us now
            </motion.a>
            <motion.div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,74,173,0.08), rgba(224,0,0,0.05))",
                border: "1.5px solid rgba(0,74,173,0.12)",
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="w-10 h-10 rounded-lg grid place-items-center text-white"
                style={{
                  background: "linear-gradient(135deg, #004AAD, #1075CF)",
                }}
              >
                <Headphones size={18} />
              </div>
              <div>
                <div
                  style={{ fontSize: 12.5, fontWeight: 800, color: "#083067" }}
                >
                  Avg. wait under 60 sec
                </div>
                <div style={{ fontSize: 11.5, color: "#5a7490" }}>
                  9:30 AM – 10:00 PM AEST, 7 days
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <motion.article
              className={`faq-item ${open === index ? "open" : ""}`}
              key={question}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ x: 7 }}
            >
              <motion.button
                onClick={() => setOpen(open === index ? null : index)}
                aria-expanded={open === index}
                whileTap={{ scale: 0.995 }}
              >
                <HelpCircle size={18} /> {question}
                <motion.div
                  animate={{ rotate: open === index ? 180 : 0 }}
                  transition={{
                    duration: 0.35,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <ChevronDown size={19} />
                </motion.div>
              </motion.button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.p
                    initial={{ height: 0, opacity: 0, y: -14 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -14 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Callout({ goTo }: { goTo: (path: string) => void }) {
  return (
    <motion.section
      className="callout"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-120px" }}
    >
      <GradientOrbs accent />
      <FloatingParticles count={28} />
      <CinematicScene>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${holidayImages.culture})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.12,
              filter: "saturate(1.3) blur(1px)",
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="relative z-10"
        >
          <p className="eyebrow light">
            <span /> Ready for take-off
          </p>
          <h2>
            Good journeys start
            <br />
            with a{" "}
            <span className="gradient-text-white">good conversation.</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              color: "rgba(196,224,246,0.85)",
              maxWidth: 520,
              lineHeight: 1.8,
              marginTop: 20,
              fontSize: 15.5,
            }}
          >
            Tell us your dream destination — we'll find the fares, plan the
            stops and take care of every detail.
          </motion.p>
        </motion.div>
        <div className="flex flex-wrap gap-4 justify-center relative z-10">
          <motion.a
            className="button button-light"
            href="tel:0287597722"
            initial={{ opacity: 0, scale: 0.88, y: 34 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.25,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 30px 60px rgba(255,255,255,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Talk to an expert
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight size={17} />
            </motion.span>
          </motion.a>
          <motion.button
            className="button button-blue"
            onClick={() => goTo("/contact")}
            initial={{ opacity: 0, scale: 0.88, y: 34 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.35,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageSquare size={16} /> Send a message
          </motion.button>
        </div>
      </CinematicScene>
    </motion.section>
  );
}

function Footer({
  goTo,
  hideBank,
}: {
  goTo: (path: string) => void;
  hideBank?: boolean;
}) {
  return (
    <footer>
      <div className="footer-grid">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Logo className="footer-logo" />
          <p className="footer-copy">
            Independent travel advice for people who like their journeys to feel
            effortless. Flights, stays and experiences — booked with care.
          </p>
          <div className="socials">
            {[
              {
                icon: Facebook,
                href: "https://www.facebook.com/flightsdoctorau",
                label: "Facebook",
                color: "#1877F2",
              },
              {
                icon: Instagram,
                href: "https://www.instagram.com",
                label: "Instagram",
                color: "#E1306C",
              },
            ].map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.12 + i * 0.09,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{
                  scale: 1.25,
                  rotate: -8,
                  boxShadow: `0 0 30px ${s.color}66`,
                }}
                whileTap={{ scale: 0.9 }}
              >
                <s.icon size={17} />
              </motion.a>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <h4>Visit us</h4>
          <a
            href="https://maps.google.com/?q=3+Parramatta+Square+Parramatta+NSW"
            className="footer-link"
          >
            <MapPin size={15} /> Level 14, 3 Parramatta Square,
            <br />
            153 Macquarie St, Parramatta
            <br />
            NSW 2150 Australia
          </a>
          <p className="footer-link">
            <Clock3 size={15} /> 9:30 AM – 10:00 PM AEST, 7 days
          </p>
          <a href="https://www.flightsdoctor.com.au" className="footer-link">
            <Globe2 size={15} /> www.flightsdoctor.com.au
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <h4>Contact</h4>
          <a href="tel:0287597722" className="footer-link">
            <Phone size={15} /> TEL: 02 87597722
          </a>
          <a href="mailto:info@flightsdoctor.com.au" className="footer-link">
            <Mail size={15} /> info@flightsdoctor.com.au
          </a>
          <a
            href="https://www.facebook.com/flightsdoctorau"
            className="footer-link"
          >
            <Facebook size={15} /> facebook.com/flightsdoctorau
          </a>
        </motion.div>
        {!hideBank && (
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24 }}
          >
            <h4>Bank transfer</h4>
            <p className="bank-name">
              <Landmark size={15} /> FLIGHTS DOCTOR
            </p>
            {banks.map((bank) => (
              <div className="bank-row" key={bank.name}>
                <motion.strong whileHover={{ color: "#ffffff", scale: 1.05 }}>
                  {bank.name}
                </motion.strong>
                <span>BSB: {bank.bsb}</span>
                <span>Acc: {bank.acc}</span>
              </div>
            ))}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4>Explore</h4>
          <motion.button whileHover={{ x: 6 }} onClick={() => goTo("/")}>
            Home
          </motion.button>
          <a href="#packages" className="footer-link-btn">
            Holiday packages
          </a>
          <a href="#routes" className="footer-link-btn">
            Domestic flights
          </a>
          <a href="#faq" className="footer-link-btn">
            FAQ
          </a>
          <motion.button whileHover={{ x: 6 }} onClick={() => goTo("/terms")}>
            Terms & Conditions
          </motion.button>
          <motion.button whileHover={{ x: 6 }} onClick={() => goTo("/contact")}>
            Contact
          </motion.button>
        </motion.div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Flights Doctor Pty Ltd · ATAS Accredited
        </span>
        <motion.span
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Travel made personal ·{" "}
          <Heart size={11} className="inline -mt-0.5" fill="#E00000" /> by our
          team
        </motion.span>
      </div>
    </footer>
  );
}

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
};
const initialContact: ContactForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

function ContactPage({ goTo }: { goTo: (path: string) => void }) {
  const [form, setForm] = useState<ContactForm>(initialContact);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const update = (key: keyof ContactForm, value: string | boolean) =>
    setForm((c) => ({ ...c, [key]: value }));

  const validate = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.message.trim() ||
      !form.consent
    )
      return "Please complete all required fields and accept the terms.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 8)
      return "Please enter a valid phone number.";
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      setFormError(error);
      setStatus("error");
      return;
    }
    setFormError("");
    setStatus("loading");
    const payload = {
      ...form,
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
      subject: "Contact Page Enquiry",
      to: "info@flightsdoctor.com.au",
      botcheck: "",
    };
    try {
      if (!payload.access_key)
        throw new Error("Form endpoint is not configured");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Unable to submit");
      setStatus("success");
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setFormError(
        "We could not send your message online. You can still email us directly below.",
      );
    }
  };

  return (
    <main className="contact-page">
      <CinematicScene>
        <section className="contact-hero relative overflow-hidden">
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${contactImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.35) saturate(1.2)",
            }}
            className="parallax-bg"
          />
          <GradientOrbs accent />
          <FloatingParticles count={26} />
          <div className="container">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span /> We're here to help
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Contact <em>Flights Doctor</em>
            </motion.h1>
            <motion.p
              className="contact-subtext"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
            >
              We're here to help with enquiries, complaints, or travel
              questions. Drop us a message and our Australian team will reply
              within business hours.
            </motion.p>
          </div>
        </section>
      </CinematicScene>
      <div className="container contact-layout">
        <motion.div
          className="contact-form-wrap gsap-reveal"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <TiltCard className="h-full" depth={26}>
            <div className="contact-form-heading">
              <MessageSquare size={25} />
              <h2>Send us a message</h2>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <label className="contact-label">
                Name
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  aria-label="Your full name"
                />
                <span className="input-shine" />
              </label>
              <label className="contact-label">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Your email address"
                />
                <span className="input-shine" />
              </label>
              <label className="contact-label">
                Phone number
                <div className="phone-wrap">
                  <PhoneInput
                    country={"au"}
                    value={form.phone}
                    onChange={(value: string) => update("phone", value)}
                    inputClass="contact-phone-input"
                    buttonClass="contact-phone-button"
                    containerClass="contact-phone-container"
                    dropdownClass="contact-phone-dropdown"
                    inputProps={{
                      name: "phone",
                      required: true,
                      "aria-label": "Phone number",
                    }}
                  />
                </div>
              </label>
              <label className="contact-label">
                Message
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Type your enquiry, complaint, or question here…"
                  aria-label="Your message"
                />
                <span className="char-count">
                  {form.message.length} characters
                </span>
              </label>
              <label className="consent contact-consent">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span>
                  I accept the{" "}
                  <button type="button" onClick={() => goTo("/terms")}>
                    Terms & Conditions
                  </button>{" "}
                  and Privacy Policy.
                </span>
              </label>
              <AnimatePresence>
                {formError && (
                  <motion.p
                    className="form-message error"
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                  >
                    {formError}{" "}
                    {status === "error" && (
                      <a
                        href={`mailto:info@flightsdoctor.com.au?subject=Contact%20Page%20Enquiry&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`)}`}
                      >
                        Email us instead
                      </a>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.button
                disabled={status === "loading"}
                className="button button-primary full"
                type="submit"
                whileHover={
                  status !== "loading"
                    ? {
                        scale: 1.03,
                        boxShadow: "0 22px 54px rgba(224,0,0,0.55)",
                      }
                    : {}
                }
                whileTap={status !== "loading" ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {status === "loading" ? (
                    <motion.span
                      key="loading"
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        className="loading-spinner"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Sending…
                    </motion.span>
                  ) : (
                    <motion.span key="idle" className="flex items-center gap-2">
                      Send Message <Send size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </TiltCard>
        </motion.div>
        <motion.aside
          className="contact-info"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <h3>Get in touch</h3>
          {[
            {
              icon: MapPin,
              label: "Visit us",
              content:
                "Level 14, 3 Parramatta Square,\n153 Macquarie St, Parramatta\nNSW 2150 Australia",
              isLink: false,
            },
            {
              icon: Phone,
              label: "Call us",
              content: "02 87597722",
              href: "tel:0287597722",
            },
            {
              icon: Mail,
              label: "Email us",
              content: "info@flightsdoctor.com.au",
              href: "mailto:info@flightsdoctor.com.au",
            },
            {
              icon: Clock3,
              label: "Business hours",
              content: "9:30 AM – 10:00 PM AEST\n7 days a week",
              isLink: false,
            },
            {
              icon: Globe2,
              label: "Website",
              content: "www.flightsdoctor.com.au",
              href: "https://www.flightsdoctor.com.au",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="contact-info-item gsap-reveal"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.09 }}
              whileHover={{ x: 9, y: -5, scale: 1.01 }}
            >
              <motion.div
                className="contact-info-icon"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.12,
                }}
              >
                <item.icon size={18} strokeWidth={1.8} />
              </motion.div>
              <div>
                <strong>{item.label}</strong>
                {item.isLink === false ? (
                  <p style={{ whiteSpace: "pre-line" }}>{item.content}</p>
                ) : (
                  <a href={item.href}>{item.content}</a>
                )}
              </div>
            </motion.div>
          ))}
          <motion.div
            className="rounded-2xl overflow-hidden border mt-2"
            style={{
              borderColor: "#E5E8EF",
              boxShadow: "0 14px 36px rgba(8,48,103,0.1)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1 }}
          >
            <img
              src={contactImage}
              alt="Flights Doctor team"
              loading="lazy"
              className="w-full h-48 object-cover"
              style={{ filter: "saturate(1.1)" }}
            />
            <div
              className="p-4"
              style={{
                background: "linear-gradient(135deg, #ffffff, #F0F1F6)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#083067",
                  letterSpacing: ".4px",
                }}
              >
                Our Australian team
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#5a7490",
                  marginTop: 4,
                  lineHeight: 1.6,
                }}
              >
                Speak directly with a real travel expert — 7 days a week.
              </p>
            </div>
          </motion.div>
          <div className="contact-socials">
            {[
              {
                icon: Facebook,
                href: "https://www.facebook.com/flightsdoctorau",
                label: "Facebook",
                color: "#1877F2",
              },
              {
                icon: Instagram,
                href: "https://www.instagram.com",
                label: "Instagram",
                color: "#E1306C",
              },
            ].map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1 + i * 0.12,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.25,
                  rotate: 8,
                  boxShadow: `0 0 30px ${s.color}55`,
                }}
                whileTap={{ scale: 0.9 }}
              >
                <s.icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.aside>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="success-modal"
              initial={{ scale: 0.78, opacity: 0, y: 40, rotateX: -22 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 18, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="success-check"
                initial={{ scale: 0, rotate: -200 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.25,
                  type: "spring",
                  damping: 12,
                  stiffness: 220,
                }}
              >
                <Check size={44} strokeWidth={2.5} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-2 mb-3"
                  style={{
                    fontSize: 11,
                    color: "#5a7490",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  <Sparkles size={13} style={{ color: "#FFB800" }} /> Message
                  sent
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Thank you!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your message has been sent. Our friendly team will be in touch
                shortly — usually within a few hours during business days.
              </motion.p>
              <motion.button
                className="button button-primary"
                onClick={() => {
                  setShowModal(false);
                  setForm(initialContact);
                  setStatus("idle");
                }}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >
                <Check size={15} /> Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer goTo={goTo} hideBank />
    </main>
  );
}

function Terms() {
  const [open, setOpen] = useState(terms.map((_, index) => index === 0));
  return (
    <main className="terms-page">
      <CinematicScene>
        <section className="terms-hero relative overflow-hidden">
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${termsHeroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.3) saturate(1.25)",
            }}
            className="parallax-bg"
          />
          <GradientOrbs accent />
          <FloatingParticles count={24} />
          <div className="container relative z-10">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span /> Customer care
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Terms &<br />
              <em>conditions.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
            >
              Clear expectations make for better journeys. Here's everything you
              need to know before booking with Flights Doctor.
            </motion.p>
            <div className="terms-actions">
              <motion.button
                className="button button-primary"
                onClick={() => window.print()}
                whileHover={{
                  scale: 1.07,
                  boxShadow: "0 18px 44px rgba(224,0,0,0.55)",
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, x: -26 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Printer size={16} /> Print this page
              </motion.button>
              <a
                className="button button-quiet"
                href="mailto:info@flightsdoctor.com.au"
              >
                Questions? Email us <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </CinematicScene>
      <div className="container terms-content">
        <motion.aside
          initial={{ opacity: 0, x: -34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="gsap-reveal"
        >
          <span>Flights Doctor Pty Ltd</span>
          <small>Last updated September 2026</small>
          <motion.div
            className="privacy-badge"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 18px 44px rgba(0,74,173,0.2)",
            }}
          >
            <ShieldCheck size={20} />
            <strong>Your privacy matters</strong>
            <p>
              We use your details only to arrange and support your travel.
              Secure and confidential.
            </p>
          </motion.div>
          <motion.div
            className="mt-5 rounded-2xl overflow-hidden border"
            style={{ borderColor: "#E5E8EF" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -3 }}
          >
            <img
              src={termsDocumentsImage}
              alt="Booking documents"
              loading="lazy"
              className="w-full h-40 object-cover"
            />
            <div
              className="p-4"
              style={{
                background: "linear-gradient(135deg, #ffffff, #F0F1F6)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: "#083067" }}>
                Need help with terms?
              </div>
              <a
                href="tel:0287597722"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12.5,
                  color: "#E00000",
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                <Phone size={13} /> 02 87597722
              </a>
            </div>
          </motion.div>
        </motion.aside>
        <div className="terms-list">
          {terms.map(([title, copy], index) => (
            <motion.article
              className={`term-item gsap-reveal ${open[index] ? "open" : ""}`}
              key={title}
              initial={{ opacity: 0, x: 44 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: index * 0.06, duration: 0.6 }}
            >
              <motion.button
                onClick={() =>
                  setOpen((current) =>
                    current.map((value, i) => (i === index ? !value : value)),
                  )
                }
                aria-expanded={open[index]}
                whileHover={{ x: 7 }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{title}</strong>
                <motion.div
                  animate={{ rotate: open[index] ? 180 : 0 }}
                  transition={{ duration: 0.35, type: "spring" }}
                >
                  <ChevronDown size={19} />
                </motion.div>
              </motion.button>
              <AnimatePresence initial={false}>
                {open[index] && (
                  <motion.p
                    style={{ whiteSpace: "pre-line" }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {copy}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
