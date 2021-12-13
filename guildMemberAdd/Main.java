
package net.Phoenix.welcomer;



import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;

import java.io.InputStreamReader;
import java.net.URLConnection;

import net.dv8tion.jda.api.events.message.react.MessageReactionAddEvent;
import net.dv8tion.jda.api.utils.AttachmentOption;
import java.net.URL;
import java.nio.channels.Channel;
import java.util.*;

import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent;
import java.awt.Composite;
import java.awt.AlphaComposite;
import java.awt.RenderingHints;
import java.awt.FontFormatException;
import java.io.IOException;
import java.awt.Graphics;
import java.awt.image.RenderedImage;
import java.awt.GraphicsEnvironment;
import java.awt.Font;
import javax.annotation.Nonnull;
import javax.imageio.ImageIO;
import java.io.File;
import java.awt.Graphics2D;
import java.awt.image.ImageObserver;
import java.awt.image.BufferedImage;
import java.awt.Image;
import javax.security.auth.login.LoginException;

import net.dv8tion.jda.api.OnlineStatus;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.hooks.EventListener;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.apache.commons.lang3.StringUtils;


public class Main extends ListenerAdapter implements EventListener
{
    public static JDABuilder builder = JDABuilder.createDefault(token.getToken());
    public static JDA jda;
    private static HashMap<Long, String> people = new HashMap<>();

    
    public static void main(final String[] args) throws LoginException, InterruptedException {
        Main.builder.enableIntents(GatewayIntent.GUILD_MEMBERS);
        Main.builder.addEventListeners(new Main());
        Main.builder.setStatus(OnlineStatus.ONLINE);
        (Main.jda = Main.builder.build()).awaitReady();

    }
    
    public static BufferedImage toBufferedImage(final Image img) {
        if (img instanceof BufferedImage) {
            return (BufferedImage)img;
        }
        final BufferedImage bimage = new BufferedImage(img.getWidth(null), img.getHeight(null), 2);
        final Graphics2D bGr = bimage.createGraphics();
        bGr.drawImage(img, 0, 0, null);
        bGr.dispose();
        return bimage;
    }
    
    public static File addPeople(final String username, final Image icon) throws IOException, FontFormatException {
        final File f = new File("~/ESI/bg.png");
        final Image img = ImageIO.read(f);
        final BufferedImage img2 = toBufferedImage(img);
        final Image icons = icon.getScaledInstance(400, 400, 0);
        final Image logo = toCircle(icons);
        final BufferedImage img3 = toBufferedImage(logo);
        final BufferedImage combined = new BufferedImage(1291, 744, 2);
        final Graphics g = combined.getGraphics();
        g.drawImage(img2, -185, -87, null);
        g.drawImage(img3, 70, 169, null);
        final Font customFont = Font.createFont(0, new File("~/ESI/fonts/Roboto-Light.ttf")).deriveFont(13.0f);
        final GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        ge.registerFont(customFont);
        g.setFont(customFont);
        final String usernamefirst16 = abbreviate(username, 24, "...");
        g.setFont(g.getFont().deriveFont(50.0f));
        final String hl1 = usernamefirst16;
        final Font bold = customFont.deriveFont(45.0f).deriveFont(1);
        final String hl2 = "Welcome to the Empire of Sindria";
        final String hl3 = "discord server. If you want to ";
        final String hl4 = "apply, do ";
        final String hl4p2 = ".apply [IGN] in here";
        final String hl4p3 = "or in #bot-commands.";
        final String hl5 = "If you're just visiting, have fun!";
        g.setFont(bold);
        g.setFont(g.getFont().deriveFont(65.0f));
        g.drawString(hl1, 560, 170);
        g.setFont(customFont);
        g.setFont(g.getFont().deriveFont(45.0f));
        g.drawString(hl2, 560, 280);
        g.drawString(hl3, 560, 345);
        g.drawString(hl4, 560, 420);
        g.setFont(bold);
        g.drawString(hl4p2, 747, 420);
        g.drawString(hl4p3, 560, 505);
        g.setFont(customFont.deriveFont(45.0f));
        g.drawString(hl5, 560, 570);
        g.dispose();
        final File xy = new File("./image.png");
        ImageIO.write(combined, "PNG", xy);
        return xy;
    }
    
    public static Image toCircle(final Image logo) throws IOException {
        final BufferedImage image = new BufferedImage(400, 400, 2);
        final Graphics2D g = image.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.fillOval(1, 1, 400, 400);
        g.setComposite(AlphaComposite.SrcIn);
        g.drawImage(logo, 0, 0, null);
        g.dispose();
        final File xy = new File("./logo.png");
        ImageIO.write(image, "PNG", xy);
        return ImageIO.read(xy);
    }
    
    public static String abbreviate(final String s, final int maxLength, String appendToEnd) {
        String result = s;
        String finalr = result;
        appendToEnd = ((appendToEnd == null) ? "" : appendToEnd);
        if (maxLength >= appendToEnd.length()) {
            if (s.length() > maxLength) {
                result = StringUtils.abbreviate(s, maxLength-3);
                finalr = result+"...";
            }
            return finalr;
        }
        throw new StringIndexOutOfBoundsException("maxLength can not be smaller than appendToEnd parameter length.");
    }


    
    @Override
    public void onGuildMemberJoin(final GuildMemberJoinEvent event) {

        final Member member = event.getMember();
        final User user = member.getUser();
        final Guild g = event.getGuild();
        final TextChannel channels = g.getTextChannelById("554418045397762050");
        assert channels != null;
        URLConnection connection = null;
        try {
            final URL conn = new URL(Objects.requireNonNull(user.getAvatarUrl()));
            connection = conn.openConnection();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        Image img = null;
        try {
            if (connection.getInputStream() != null) {
                img = ImageIO.read(connection.getInputStream());
            }
        }
        catch (Exception e2) {
            e2.printStackTrace();
        }
        try {
            channels.sendFile(addPeople(event.getMember().getUser().getName(), img), new AttachmentOption[0]).complete();
        }
        catch (IOException | FontFormatException ex2) {
            ex2.printStackTrace();
        }
    }
    
    @Override
    public void onMessageReceived(final MessageReceivedEvent event) {
        ArrayList str = new ArrayList(Arrays.asList(event.getMessage().getContentRaw().split(" ")));
        if (str.get(0).equals(".onlinecheck")) {
            event.getChannel().sendMessage("Yep, java is online").complete();
        }
        if(event.getMessage().getContentRaw().equalsIgnoreCase("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!")){
            if(event.getAuthor().isBot()){
                if(event.getAuthor().getId().equals("781588726438035476")){
                    TextChannel ch = event.getGuild().getTextChannelById(683093425452744778L);
                    String name = event.getChannel().getName().split("-")[1];
                    ch.sendMessage("Please react if you have invited " + name).queue((message) -> {
                        message.pin().queue();
                        message.addReaction(event.getGuild().getEmoteById(820858331811020833L)).queue();
                        people.put(message.getIdLong(), name);
                    });
                }
            }
        }

    }

    @Override
    public void onMessageReactionAdd(MessageReactionAddEvent event){
        if(people.containsKey(event.getMessageIdLong())){
            if(!event.getMember().getUser().isBot()){
                if(event.getReaction().getReactionEmote().getEmote().equals(event.getGuild().getEmoteById(820858331811020833L))){
                    Message msg = event.getChannel().retrieveMessageById(event.getMessageId()).complete();
                    msg.unpin().complete();
                    msg.clearReactions().complete();
                    msg.addReaction(event.getGuild().getEmoteById(820858264249958413L)).complete();
                    msg.editMessage(event.getMember().getNickname() + " has invited " + people.get(event.getMessageIdLong())+ ". React again if it was by mistake").complete();

                }
                if(event.getReaction().getReactionEmote().getEmote().equals(event.getGuild().getEmoteById(820858264249958413L))){
                    Message msg = event.getChannel().retrieveMessageById(event.getMessageId()).complete();
                    msg.pin().complete();
                    msg.editMessage("Please invite " + people.get(event.getMessageIdLong())).complete();
                }
            }
        }
    }


}
