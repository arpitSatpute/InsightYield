import React, { useState, useEffect } from 'react';
import { Mail, Send, User, MessageSquare, MessageCircle,Phone, MapPin, Twitter, Github, Linkedin, Globe, CheckCircle, Landmark, Gauge, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/layouts/default';
import { DiscordIcon, GithubIcon, TwitterIcon } from '@/components/icons';

export default function ContactPage() {
    const [isDark, setIsDark] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);

    const socialLinks = [
        {
            name: 'Twitter',
            icon: TwitterIcon,
            url: 'https://twitter.com/insightyields',
            handle: '@arpits_jsx',
            color: 'bg-gray-900 text-white'
        },
        {
            name: 'GitHub',
            icon: GithubIcon,
            url: 'https://github.com/insightyields',
            handle: 'github.com/arpitSatpute',
            color: 'bg-gray-900 text-white'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: 'https://linkedin.com/in/arpitsatpute',
            handle: 'linkedin.com/in/arpitsatpute',
            color: 'bg-gray-900 text-white'
        },
        {
            name: 'Discord',
            icon: DiscordIcon,
            url: 'https://discord.gg/arpitS_15',
            handle: 'discord.gg/arpits_15',
            color: 'bg-gray-900 text-white'
        }
        
    ];

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: "Arpit Satpute",
            link: 'mailto:arpitrameshsatpute6986@gmail.com',
            color: 'bg-indigo-500/10 text-indigo-500'
        },
        // {
        //     icon: Phone,
        //     label: 'Phone',
        //     value: '+1 (555) 123-4567',
        //     link: 'tel:+15551234567',
        //     color: 'bg-cyan-500/10 text-cyan-500'
        // },
        // {
        //     icon: MapPin,
        //     label: 'Location',
        //     value: 'San Francisco, CA',
        //     link: null,
        //     color: 'bg-orange-500/10 text-orange-500'
        // }
    ];

    const faqItems = [
        {
            title: 'How does the vault work?',
            description: 'Learn about our automated yield optimization',
            icon: Landmark,
            color: 'bg-indigo-500/10 border-indigo-500/20'
        },
        {
            title: 'What are the fees?',
            description: 'Transparent fee structure explained',
            icon: Gauge,
            color: 'bg-cyan-500/10 border-cyan-500/20'
        },
        {
            title: 'Is it secure?',
            description: 'Security measures and audits',
            icon: Zap,
            color: 'bg-orange-500/10 border-orange-500/20'
        }
    ];

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus("success");
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            setTimeout(() => {
                setSubmitStatus(null);
            }, 5000);
        }, 2000);
    };

    return (
        <DefaultLayout>
            <main className="overflow-hidden bg-background min-h-screen">
                {/* Background Effects */}
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                </div>

                <section className="relative">
                    <div className="relative pt-24 md:pt-36 pb-24">
                        <div className="absolute inset-0 -z-20">
                            <img
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width="3276"
                                height="4095"
                            />
                        </div>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        
                        <div className="mx-auto max-w-7xl px-6">
                            {/* Header */}
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-muted/50 backdrop-blur-sm mb-6">
                                    <span className="text-sm">💬 Get in Touch</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                                    Contact Us
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Have questions about our yield aggregator? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                                </p>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                                {/* Contact Form */}
                                <div className="lg:col-span-2 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Send us a Message</h2>
                                    </div>

                                    {submitStatus === 'success' && (
                                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                                            <div>
                                                <div className="font-semibold text-green-500 dark:text-green-400">Message Sent!</div>
                                                <div className="text-sm text-muted-foreground">We'll get back to you shortly.</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Name *
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder="John Doe"
                                                        className="w-full pl-11 pr-4 py-3 bg-muted border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Email *
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="john@example.com"
                                                        className="w-full pl-11 pr-4 py-3 bg-muted border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Subject *
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                placeholder="How can we help you?"
                                                className="w-full px-4 py-3 bg-muted border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Message *
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={6}
                                                placeholder="Tell us more about your inquiry..."
                                                className="w-full px-4 py-3 bg-muted border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                            />
                                        </div>

                                        <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                                            <Button
                                                onClick={handleSubmit}
                                                size="lg"
                                                disabled={isSubmitting}
                                                className="w-full rounded-xl text-base">
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="animate-spin mr-2">⏳</span>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 w-4 h-4" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Sidebar */}
                                <div className="space-y-6">
                                    {/* Contact Info Cards */}
                                    {contactInfo.map((info, index) => (
                                        <div key={index} className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                    <info.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                                                    {info.link ? (
                                                        <a
                                                            href={info.link}
                                                            className="font-semibold hover:text-primary transition-colors break-all">
                                                            {info.value}
                                                        </a>
                                                    ) : (
                                                        <div className="font-semibold">{info.value}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Response Time Card */}
                                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-primary" />
                                            </div>
                                            <h3 className="font-bold">Quick Response</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            We typically respond within 24 hours during business days.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Section */}
                            <div className="mb-16">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect With Us</h2>
                                    <p className="text-lg text-muted-foreground">Follow us on social media for updates and insights</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300 group">
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                    <social.icon className="w-8 h-8" />
                                                </div>
                                                <h3 className="font-bold text-lg mb-2">{social.name}</h3>
                                                <p className="text-sm text-muted-foreground">{social.handle}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-16 text-center">
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted/50 border rounded-full hover:border-foreground/20 transition-all duration-300">
                                    <span className="text-sm text-muted-foreground">
                                        Join our community on Discord for real-time support
                                    </span>
                                    <span className="text-primary font-semibold">→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </DefaultLayout>
    );
}