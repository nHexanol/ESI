package net.Phoenix.welcomer;

import com.google.common.base.Splitter;
import me.bed0.jWynn.WynncraftAPI;
import me.bed0.jWynn.api.common.GuildRank;
import me.bed0.jWynn.api.v1.guild.WynncraftGuildMember;
import me.bed0.jWynn.api.v2.player.PlayerTag;
import me.bed0.jWynn.api.v2.player.WynncraftPlayer;
import me.bed0.jWynn.api.v2.player.classes.WynncraftPlayerClass;
import me.bed0.jWynn.api.v2.player.classes.WynncraftPlayerClassRaidIndividual;
import me.bed0.jWynn.api.v2.player.classes.professions.WynncraftPlayerClassProfessions;
import me.bed0.jWynn.exceptions.APIRequestException;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.events.guild.member.GuildMemberJoinEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.io.*;
import java.net.URISyntaxException;
import java.net.URLConnection;

import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import net.dv8tion.jda.api.utils.AttachmentOption;
import java.net.URL;
import java.text.NumberFormat;
import java.util.*;

import java.awt.image.BufferedImage;
import java.util.List;
import java.util.concurrent.TimeUnit;
import javax.imageio.ImageIO;
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
    public static int counter;
    public HashMap<Member, Integer> number = new HashMap<>();
    public HashMap<Member, String> username = new HashMap<>();


    public static void main( String[] args) throws LoginException, InterruptedException {
        builder.enableIntents(GatewayIntent.GUILD_MEMBERS);
        builder.addEventListeners(new Main());
        builder.setStatus(OnlineStatus.ONLINE);
        jda = builder.build().awaitReady();
        jda.upsertCommand("player", "View a player's stats")
                .addOption(OptionType.STRING, "pname", "The player who's stats you want to see", true)
                .queue();
        jda.getGuildById("554418045397762048").upsertCommand("player", "View a player's stats")
                .addOption(OptionType.STRING, "pname", "The player who's stats you want to see", true)
                .queue();
        counter = 1;
    }

    public BufferedImage toBufferedImage( Image img) {
        if (img instanceof BufferedImage) {
            return (BufferedImage)img;
        }
        BufferedImage bimage = new BufferedImage(img.getWidth(null), img.getHeight(null), 2);
        Graphics2D bGr = bimage.createGraphics();
        bGr.drawImage(img, 0, 0, null);
        bGr.dispose();
        return bimage;
    }

    public static File getFile(InputStream resourcePath) {
        try {
            if (resourcePath == null) {
                return null;
            }

            File tempFile = File.createTempFile(String.valueOf(resourcePath.hashCode()), ".tmp");
            tempFile.deleteOnExit();

            try (FileOutputStream out = new FileOutputStream(tempFile)) {
                //copy stream
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = resourcePath.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }
            return tempFile;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public File addPeople( String username,  Image icon) throws IOException, FontFormatException, URISyntaxException {
        BufferedImage img2 = ImageIO.read(Main.class.getResourceAsStream("/welcome/" + counter + ".png"));
        Image icons = icon.getScaledInstance(400, 400, 0);
        Image logo = toCircle(icons);
        BufferedImage img3 = toBufferedImage(logo);
        Graphics g = img2.getGraphics();
        g.drawImage(img3, 70, 169, null);
        File fontFile = getFile(Main.class.getResourceAsStream("/Ubuntu-Light.ttf"));
        Font customFont = Font.createFont(0, fontFile).deriveFont(13.0f);
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        ge.registerFont(customFont);
        g.setFont(customFont);
        String usernamefirst16 = StringUtils.abbreviate(username, 20);
        g.setFont(g.getFont().deriveFont(50.0f));
        String hl1 = usernamefirst16;
        Font bold = customFont.deriveFont(45.0f).deriveFont(1);
        String hl2 = "Welcome to the Empire of Sindria";
        String hl3 = "discord server. If you want to ";
        String hl4 = "apply, do ";
        String hl4p2 = "/apply [IGN] in here";
        String hl4p3 = "or in #bot-commands.";
        String hl5 = "If you're just visiting, have fun!";
        g.setFont(bold);
        g.setFont(g.getFont().deriveFont(65.0f));
        g.drawString(hl1, 560, 170);
        g.setFont(customFont);
        g.setFont(g.getFont().deriveFont(45.0f));
        g.drawString(hl2, 560, 270);
        g.drawString(hl3, 560, 345);
        g.drawString(hl4, 560, 420);
        g.setFont(bold);
        g.drawString(hl4p2, 752, 420);
        g.drawString(hl4p3, 560, 495);
        g.setFont(customFont.deriveFont(45.0f));
        g.drawString(hl5, 560, 570);
        g.dispose();
        File xy = new File("./image.png");
        ImageIO.write(img2, "PNG", xy);
        return xy;
    }

    public File getClassDetails(String username, int classname, Member member){
        File finalimage = new File("./classimg.png");
        try {
            Image image = ImageIO.read(Main.class.getResourceAsStream("/class/img.png"));
            BufferedImage img = toBufferedImage(image);
            Graphics2D g = (Graphics2D) img.getGraphics();
            WynncraftAPI api = new WynncraftAPI();
            WynncraftPlayer player = api.v2().player().stats(username).run()[0];
            WynncraftPlayerClass playerClass = player
                    .getClasses()[classname-1];
            Font customFont = Font.createFont(0, getFile(Main.class.getResourceAsStream("/Ubuntu-Light.ttf"))).deriveFont(100f);
            GraphicsEnvironment.getLocalGraphicsEnvironment()
                    .registerFont(customFont);
            g.setFont(g.getFont().deriveFont(60f));
            g.setFont(g.getFont().deriveFont(Font.BOLD));
            int proflevel = playerClass.getProfessions().getAlchemism().getLevel()
                    + playerClass.getProfessions().getArmouring().getLevel()
                    + playerClass.getProfessions().getCombat().getLevel()
                    + playerClass.getProfessions().getCooking().getLevel()
                    + playerClass.getProfessions().getFarming().getLevel()
                    + playerClass.getProfessions().getJeweling().getLevel()
                    + playerClass.getProfessions().getMining().getLevel()
                    + playerClass.getProfessions().getScribing().getLevel()
                    + playerClass.getProfessions().getTailoring().getLevel()
                    + playerClass.getProfessions().getWeaponsmithing().getLevel()
                    + playerClass.getProfessions().getWoodworking().getLevel()
                    + playerClass.getProfessions().getWoodcutting().getLevel();
            String rank = player.getMeta().getTag().getValue() == PlayerTag.NONE ? "" : " [" + player.getMeta().getTag().getValue().getFriendlyName() + "] ";
            g.drawString(rank
                            + username
                            + " ["
                            + playerClass.getBaseClass().substring(0, 1).toUpperCase() + playerClass.getBaseClass().substring(1)
                            + "]"
                            + " ["
                            + playerClass.getProfessions().getCombat().getLevel()
                            + "/"
                            + proflevel
                            + "]",
                    75, 100);
            g.drawString("Raids : ", 75, 175);

            g.setFont(g.getFont().deriveFont(Font.PLAIN));

            StringBuilder sb = new StringBuilder();
            for(WynncraftPlayerClassRaidIndividual wpcri : playerClass.getRaids().getList()){
                StringBuilder raidName = new StringBuilder();
                for (String s : wpcri.getName().split(" ")) {
                    raidName.append(s.charAt(0));
                }
                sb.append(raidName.toString().equals("TCC") ? (raidName + "- " + wpcri.getCompleted()) : (raidName + "- " + wpcri.getCompleted() + ", "));
            }
            String raidCombined = sb.toString();
            String skills =
                    "Agility: "
                            + playerClass.getSkills().getAgility()
                    + " Defence: "
                            + playerClass.getSkills().getDefence()
                    + " Intelligence: "
                            + playerClass.getSkills().getIntelligence()
                    + " Dexterity: "
                            + playerClass.getSkills().getDexterity()
                    + "Strength: "
                            + playerClass.getSkills().getStrength();

            g.drawString(skills, 300, 250);
            g.drawString(raidCombined, 300, 175);
            g.dispose();
            ImageIO.write(img, "PNG", finalimage);
        } catch (APIRequestException | NullPointerException e){
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String sStackTrace = sw.toString(); // stack trace as a string
            Iterable<String> pieces = Splitter.fixedLength(2000).split(sStackTrace);
            pieces.forEach(string -> {
                member.getGuild().getTextChannelById("784352935198064660").sendMessage(string).queue();
            });
            return null;
        }
        catch (Exception ex){
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            ex.printStackTrace(pw);
            String sStackTrace = sw.toString(); // stack trace as a string
            Iterable<String> pieces = Splitter.fixedLength(2000).split(sStackTrace);
            pieces.forEach(string -> {
                member.getGuild().getTextChannelById("784352935198064660").sendMessage(string).queue();
            });
        }
        return finalimage;
    }

    public File getClass(String username, int classname, Member member){
        File finalimage = new File("./classimg.png");
        try {
            if(classname <= 0){
                ClassLoader cl = Main.class.getClassLoader();
                Image image = ImageIO.read(Main.class.getResourceAsStream("/class/img.png"));
                BufferedImage img = toBufferedImage(image);
                Graphics2D g = (Graphics2D) img.getGraphics();
                WynncraftAPI api = new WynncraftAPI();
                WynncraftPlayer player = api.v2().player().stats(username).run()[0];
                File fontFile = getFile(Main.class.getResourceAsStream("/Ubuntu-Light.ttf"));
                Font customFont = Font.createFont(0, fontFile).deriveFont(13.0f);
                GraphicsEnvironment.getLocalGraphicsEnvironment()
                        .registerFont(customFont);
                g.setFont(g.getFont().deriveFont(60f));
                g.setFont(g.getFont().deriveFont(Font.BOLD));
                g.drawString("Total level : ", 75, 300);
                g.setFont(g.getFont().deriveFont(Font.PLAIN));
                g.drawString("C " + player.getGlobal().getTotalLevel().getCombat() + " + P " + player.getGlobal().getTotalLevel().getProfession() + " = " + player.getGlobal().getTotalLevel().getCombined(), 450, 300);
                try {
                    for (WynncraftGuildMember mem : player.getGuild().getDetails().runIncludeMeta().getData().getMembers()) {
                        if (mem.getDetailsRequest().run()[0].getUsername().equals(player.getUsername())) {
                            if (mem.getRank().equals(GuildRank.RECRUIT)) {
                                g.setFont(g.getFont().deriveFont(40f));
                                g.drawString("RECRUIT of " + player.getGuild().getName(), 75, 150);
                                g.setFont(g.getFont().deriveFont(60f));
                            }
                            if (mem.getRank().equals(GuildRank.RECRUITER)) {
                                player.getGuild().getDetails().runIncludeMeta().getData().getMembers();
                                g.setFont(g.getFont().deriveFont(40f));
                                g.drawString("RECRUITER of " + player.getGuild().getName(), 75, 150);
                                g.setFont(g.getFont().deriveFont(60f));
                            }
                            if (mem.getRank().equals(GuildRank.CAPTAIN)) {
                                g.setFont(g.getFont().deriveFont(40f));
                                g.drawString("CAPTAIN of " + player.getGuild().getName(), 75, 150);
                                g.setFont(g.getFont().deriveFont(60f));
                            }
                            if (mem.getRank().equals(GuildRank.STRATEGIST)) {
                                g.setFont(g.getFont().deriveFont(40f));
                                g.drawString("STRATEGIST of " + player.getGuild().getName(), 75, 150);
                                g.setFont(g.getFont().deriveFont(60f));
                            }
                            if (mem.getRank().equals(GuildRank.CHIEF)) {
                                g.setFont(g.getFont().deriveFont(40f));
                                g.drawString("CHIEF of " + player.getGuild().getName(), 75, 150);
                                g.setFont(g.getFont().deriveFont(60f));
                            }
                            if (mem.getRank().equals(GuildRank.OWNER)) {
                                g.setFont(g.getFont().deriveFont(40f));
                                g.drawString("OWNER of " + player.getGuild().getName(), 75, 150);
                                g.setFont(g.getFont().deriveFont(60f));
                            }
                        }
                    }
                }catch (NullPointerException e){
                    g.setFont(g.getFont().deriveFont(40f));
                    g.drawString("No guild", 75, 150);
                    g.setFont(g.getFont().deriveFont(60f));
                }
                if(player.getMeta().getLocation().isOnline()){
                    g.setFont(g.getFont().deriveFont(69f));
                    g.setFont(g.getFont().deriveFont(Font.BOLD));
                    String rank = player.getMeta().getTag().getValue() == PlayerTag.NONE ? "" : " [" + player.getMeta().getTag().getValue().getFriendlyName() + "]";
                    g.drawString(player.getUsername() + rank + " [" + player.getMeta().getLocation().getServer() + "]", 75, 100);
                    g.setFont(g.getFont().deriveFont(60f));
                    String world = player.getMeta().getLocation().getServer();
                    g.setFont(g.getFont().deriveFont(Font.PLAIN));
                    g.drawString("Online on [" + world + "]", 450, 650);
                }
                else {
                    g.setFont(g.getFont().deriveFont(69f));
                    g.setFont(g.getFont().deriveFont(Font.BOLD));
                    String rank = player.getMeta().getTag().getValue() == PlayerTag.NONE ? "" : " [" + player.getMeta().getTag().getValue().getFriendlyName() + "]";
                    g.drawString(player.getUsername() + rank, 75, 100);
                    g.setFont(g.getFont().deriveFont(60f));
                    Date lastjoin = player.getMeta().getLastJoin();
                    Date rightnow = new Date();
                    g.setFont(g.getFont().deriveFont(Font.PLAIN));
                    g.drawString(get(lastjoin, rightnow), 450, 650);
                    g.setFont(g.getFont().deriveFont(60f));
                }
                g.setFont(g.getFont().deriveFont(60f));
                g.setFont(g.getFont().deriveFont(Font.BOLD));
                g.drawString("Total Playtime : ", 75 , 370);
                g.setFont(g.getFont().deriveFont(Font.PLAIN));
                int playtime = (int) (player.getMeta().getPlaytime()*4.7) / 60;
                g.drawString(playtime + " hours", 590, 370);
                g.setFont(g.getFont().deriveFont(Font.BOLD));
                g.drawString("Total mobs killed : ", 75, 440);
                g.setFont(g.getFont().deriveFont(Font.PLAIN));
                NumberFormat nf = NumberFormat.getInstance(Locale.UK);
                g.drawString(nf.format(player.getGlobal().getMobsKilled()) + " mobs", 670, 440);
                g.setFont(g.getFont().deriveFont(Font.BOLD));
                g.drawString("Total Chests Opened : ", 75, 510);
                g.setFont(g.getFont().deriveFont(Font.PLAIN));
                g.drawString(nf.format(player.getGlobal().getChestsFound()) + " chests", 775, 510);
                g.setFont(g.getFont().deriveFont(Font.BOLD));
                g.drawString("Logins/Deaths : ", 75, 580);
                g.setFont(g.getFont().deriveFont(Font.PLAIN));
                g.drawString(player.getGlobal().getLogins() + "/" + player.getGlobal().getDeaths(), 570, 580);
                g.setFont(g.getFont().deriveFont(Font.BOLD));
                g.drawString("Last seen : ", 75, 650);
                Date rightnow = new Date();
                g.drawString("Joined : ", 75, 720);
                g.setFont(g.getFont().deriveFont(Font.PLAIN));
                Date joined = player.getMeta().getFirstJoin();
                g.drawString(get(joined, rightnow), 350, 720);
                TreeMap<Integer, WynncraftPlayerClass> level = new TreeMap<>();
                for(WynncraftPlayerClass plc : player.getClasses()){
                    int plevel = plc.getProfessions().getAlchemism().getLevel() +plc.getProfessions().getArmouring().getLevel() +plc.getProfessions().getCombat().getLevel() +plc.getProfessions().getCooking().getLevel() +plc.getProfessions().getFarming().getLevel() +plc.getProfessions().getJeweling().getLevel() +plc.getProfessions().getMining().getLevel() +plc.getProfessions().getScribing().getLevel() +plc.getProfessions().getTailoring().getLevel() +plc.getProfessions().getWeaponsmithing().getLevel() +plc.getProfessions().getWoodworking().getLevel() +plc.getProfessions().getWoodcutting().getLevel() +plc.getProfessions().getCombat().getLevel();
                    level.put(plevel, plc);
                }
                List<Integer> l = new ArrayList<Integer>(level.keySet());
                Collections.sort(l);
                g.setFont(g.getFont().deriveFont(Font.BOLD));
                g.drawString("Highest Levelled class : ", 75, 790);
                g.setFont(g.getFont().deriveFont(Font.PLAIN));
                WynncraftPlayerClass pclass =level.get(l.get(l.size()-1));
                int proflevel = pclass.getProfessions().getAlchemism().getLevel()
                        + pclass.getProfessions().getArmouring().getLevel()
                        + pclass.getProfessions().getCombat().getLevel()
                        + pclass.getProfessions().getCooking().getLevel()
                        + pclass.getProfessions().getFarming().getLevel()
                        + pclass.getProfessions().getJeweling().getLevel()
                        + pclass.getProfessions().getMining().getLevel()
                        + pclass.getProfessions().getScribing().getLevel()
                        + pclass.getProfessions().getTailoring().getLevel()
                        + pclass.getProfessions().getWeaponsmithing().getLevel()
                        + pclass.getProfessions().getWoodworking().getLevel()
                        + pclass.getProfessions().getWoodcutting().getLevel();
                g.drawString(pclass.getBaseClass().substring(0, 1).toUpperCase() + pclass.getBaseClass().substring(1) + " [" + pclass.getProfessions().getCombat().getLevel() + "/" + proflevel + "]", 825, 790);
                ImageIO.write(img, "PNG", finalimage);
                return finalimage;
            }
            else if(classname > 0){
                Class cl = Main.class;
                Image image = ImageIO.read(Main.class.getResourceAsStream("/class/img.png"));
                BufferedImage img = toBufferedImage(image);
                Graphics2D g = (Graphics2D) img.getGraphics();
                Image Alchmeism = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/alchemism.png"))).getScaledInstance(128, 128, 0);
                Image Armouring = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/armouring.png"))).getScaledInstance(128, 128, 0);
                Image Combat = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/combat.png"))).getScaledInstance(128, 128, 0);
                Image Cooking = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/cooking.png"))).getScaledInstance(128, 128, 0);
                Image Farming = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/farming.png"))).getScaledInstance(128, 128, 0);
                Image Fishing = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/fishing.png"))).getScaledInstance(128, 128, 0);
                Image Jeweling = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/jeweling.png"))).getScaledInstance(128, 128, 0);
                Image Mining = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/mining.png")).getScaledInstance(128, 128, 0));
                Image Scribing = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/scribing.png"))).getScaledInstance(128, 128, 0);
                Image Tailoring = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/tailoring.png"))).getScaledInstance(128, 128, 0);
                Image Weaponsmiting = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/weaponsmiting.png"))).getScaledInstance(128, 128, 0);
                Image Woodworking = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/woodworking.png"))).getScaledInstance(128, 128, 0);
                Image Woodcutting = toCircle(ImageIO.read(Main.class.getResourceAsStream("/class/asset/woodcutting.png"))).getScaledInstance(128, 128, 0);
                Font customFont = Font.createFont(0, getFile(Main.class.getResourceAsStream("/Ubuntu-Light.ttf"))).deriveFont(50f);
                GraphicsEnvironment.getLocalGraphicsEnvironment()
                        .registerFont(customFont);
                g.setFont(customFont);
                WynncraftAPI api = new WynncraftAPI();
                WynncraftPlayerClass[] playerClasses = api.v2().player().stats(username).run()[0].getClasses();
                WynncraftPlayerClass pclass = playerClasses[classname-1];
                WynncraftPlayerClassProfessions profs = pclass.getProfessions();
                g.drawImage(Alchmeism, 100, 100, null);
                g.drawString("Level: \n" + profs.getAlchemism().getLevel(), 200, 100);
                g.setStroke(new BasicStroke(10));
                g.setPaint(Color.GREEN);
                int alc = profs.getAlchemism().getLevel() == 1 ? -20 : (int) -(((float) profs.getAlchemism().getLevel() / (float) 132) * (float) 360);
                g.drawArc(100, 100, 130, 130, 90, alc);
                g.drawImage(Armouring, 500, 100, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getArmouring().getLevel(), 600, 100);
                g.setPaint(Color.GREEN);
                int arm = profs.getArmouring().getLevel() == 1 ? -20 : (int) -(((float) profs.getArmouring().getLevel() / (float) 132) * (float) 360);
                g.drawArc(500, 100, 130, 130, 90, arm);
                g.drawImage(Combat, 900, 100, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getCombat().getLevel(), 1000, 100);
                int com = profs.getCombat().getLevel() == 1 ? -20 : (int) -(((float) profs.getCombat().getLevel() / (float) 106) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(900, 100, 130, 130, 90, com);
                g.drawImage(Cooking, 100, 300, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getCooking().getLevel(), 200, 300);
                int cook = profs.getCooking().getLevel() == 1 ? -20 : (int) -(((float) profs.getCooking().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(100, 300, 130, 130, 90, cook);
                g.drawImage(Farming, 500, 300, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getFarming().getLevel(), 600, 300);
                int farm = profs.getFarming().getLevel() == 1 ? -20 : (int) -(((float) profs.getFarming().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(500, 300, 130, 130, 90, farm);
                g.drawImage(Fishing, 900, 300, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getFishing().getLevel(), 1000, 300);
                int fish = profs.getArmouring().getLevel() == 1 ? -20 : (int) -(((float) profs.getFishing().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(900, 300, 130, 130, 90, fish);
                g.drawImage(Jeweling, 100, 500, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getJeweling().getLevel(), 200, 500);
                int jewel = profs.getJeweling().getLevel() == 1 ? -20 : (int) -(((float) profs.getJeweling().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(100, 500, 130, 130, 90, jewel);
                g.drawImage(Mining, 500, 500, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getMining().getLevel(), 600, 500);
                int mine = profs.getArmouring().getLevel() == 1 ? -20 : (int) -(((float) profs.getMining().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(500, 500, 130, 130, 90, mine);
                g.drawImage(Scribing, 900, 500, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getScribing().getLevel(), 1000, 500);
                int scribe = profs.getScribing().getLevel() == 1 ? -20 : (int) -(((float) profs.getScribing().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(900, 500, 130, 130, 90, scribe);
                g.drawImage(Tailoring, 100, 700, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getTailoring().getLevel(), 200, 700);
                int tail = profs.getTailoring().getLevel() == 1 ? -20 : (int) -(((float) profs.getTailoring().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(100, 700, 130, 130, 90, tail);
                g.drawImage(Weaponsmiting, 500, 700, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getWeaponsmithing().getLevel(), 600, 700);
                int weapon = profs.getWeaponsmithing().getLevel() == 1 ? -20 : (int) -(((float) profs.getWeaponsmithing().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(500, 700, 130, 130, 90, weapon);
                g.drawImage(Woodworking, 900, 700, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getWoodworking().getLevel(), 1000, 700);
                int woodw = profs.getWoodworking().getLevel() == 1 ? -20 : (int) -(((float) profs.getWoodworking().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(900, 700, 130, 130, 90, woodw);
                g.drawImage(Woodcutting, 100, 900, null);
                g.setPaint(Color.WHITE);
                g.drawString("Level: \n" + profs.getWoodcutting().getLevel(), 200, 900);
                int woodc = profs.getWoodcutting().getLevel() == 1 ? -20 : (int) -(((float) profs.getWoodcutting().getLevel() / (float) 132) * (float) 360);
                g.setPaint(Color.GREEN);
                g.drawArc(100, 900, 130, 130, 90, woodc);
                g.setPaint(Color.WHITE);
                g.setFont(g.getFont().deriveFont(100f));
                g.drawString(pclass.getBaseClass().substring(0, 1).toUpperCase() + pclass.getBaseClass().substring(1), 1150, 400);
                ImageIO.write(img, "PNG", finalimage);
            }
        } catch (APIRequestException | NullPointerException e){
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String sStackTrace = sw.toString(); // stack trace as a string
            Iterable<String> pieces = Splitter.fixedLength(2000).split(sStackTrace);
            pieces.forEach(string -> {
                member.getGuild().getTextChannelById("784352935198064660").sendMessage(string).queue();
            });
            return null;
        }
        catch (Exception ex){
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            ex.printStackTrace(pw);
            String sStackTrace = sw.toString(); // stack trace as a string
            Iterable<String> pieces = Splitter.fixedLength(2000).split(sStackTrace);
            pieces.forEach(string -> {
                member.getGuild().getTextChannelById("784352935198064660").sendMessage(string).queue();
            });
        }
        return finalimage;
    }

    private  String getDuration(long mins, long hrs, long days, long months, long years) {
        StringBuffer sb = new StringBuffer();
        String EMPTY_STRING = "";
        sb.append(years > 0 ? years + (years > 1 ? " yr " : " yr "): EMPTY_STRING);
        sb.append(months > 0 ? months + (months > 1 ? " mon " : " mon "): EMPTY_STRING);
        sb.append(days > 0 ? days + (days > 1 ? " d " : " d "): EMPTY_STRING);
        sb.append(hrs > 0 ? hrs + (hrs > 1 ? " hr " : " hr "): EMPTY_STRING);
        sb.append(mins > 0 ? mins + (mins > 1 ? " min " : " min "): EMPTY_STRING);
        sb.append("ago");
        return sb.toString();
    }

    public String get(Date dat1, Date dat2){
        Date now = dat2;
        long durationInSeconds  = TimeUnit.MILLISECONDS.toSeconds(now.getTime() - dat1.getTime());

        long SECONDS_IN_A_MINUTE = 60;
        long MINUTES_IN_AN_HOUR = 60;
        long HOURS_IN_A_DAY = 24;
        long DAYS_IN_A_MONTH = 30;
        long MONTHS_IN_A_YEAR = 12;

        long min = (durationInSeconds /= SECONDS_IN_A_MINUTE) >= MINUTES_IN_AN_HOUR ? durationInSeconds%MINUTES_IN_AN_HOUR : durationInSeconds;
        long hrs = (durationInSeconds /= MINUTES_IN_AN_HOUR) >= HOURS_IN_A_DAY ? durationInSeconds % HOURS_IN_A_DAY : durationInSeconds;
        long days = (durationInSeconds /= HOURS_IN_A_DAY) >= DAYS_IN_A_MONTH ? durationInSeconds % DAYS_IN_A_MONTH : durationInSeconds;
        long months = (durationInSeconds /=DAYS_IN_A_MONTH) >= MONTHS_IN_A_YEAR ? durationInSeconds % MONTHS_IN_A_YEAR : durationInSeconds;
        long years = (durationInSeconds /= MONTHS_IN_A_YEAR);

        String duration = getDuration(min,hrs,days,months,years);
        return duration;
    }
    public Image toCircle( Image logo) throws IOException {
        int width = logo.getWidth(null);
        BufferedImage circleBuffer = new BufferedImage(width, width, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = circleBuffer.createGraphics();
        g2.setClip(new Ellipse2D.Float(0, 0, width, width));
        g2.drawImage(logo, 0, 0, width, width, null);
        return circleBuffer;
    }


    @Override
    public void onGuildMemberJoin(GuildMemberJoinEvent event) {

        Member member = event.getMember();
        User user = member.getUser();
        Guild g = event.getGuild();
        TextChannel channels = g.getTextChannelById("554418045397762050");
        if(counter==4){
            counter=0;
        }
        try {
            channels.sendFile(addPeople(event.getMember().getUser().getName(), getUserAvatar(user)), new AttachmentOption[0]).complete();
            counter++;
        }
        catch (Exception ex2) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            ex2.printStackTrace(pw);
            String sStackTrace = sw.toString();
            g.getTextChannelById("673360036650680321").sendMessage(sStackTrace).complete();
        }
    }

    public Image getUserAvatar(User user) throws IOException {
        URL url = user.getAvatarUrl() != null ? new URL(user.getAvatarUrl()) : null;
        Image img = null;
        if(url == null){
            Graphics g = img.getGraphics();
            g.setColor(Color.black);
            g.fillRect(0, 0, 100, 100);
            return img;
        }
        URLConnection openConnection = url.openConnection();
        boolean check = true;

        try {

            openConnection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
            openConnection.connect();

            if (openConnection.getContentLength() > 8000000) {
                System.out.println(" file size is too big.");
                check = false;
            }
        } catch (Exception e) {
            System.out.println("Couldn't create a connection to the link, please recheck the link.");
            check = false;
            e.printStackTrace();
        }
        if (check) {
            try {
                InputStream in = new BufferedInputStream(openConnection.getInputStream());
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] buf = new byte[1024];
                int n = 0;
                while (-1 != (n = in.read(buf))) {
                    out.write(buf, 0, n);
                }
                out.close();
                in.close();
                byte[] response = out.toByteArray();
                img = ImageIO.read(new ByteArrayInputStream(response));
            } catch (Exception e) {
                System.out.println(" couldn't read an image from this link.");
                e.printStackTrace();
            }
        }
        return img;
    }

    public static String getProcessOutput(String cmd) throws IOException, InterruptedException
    {
        ProcessBuilder processBuilder = new ProcessBuilder(new String[]{"bash", "-l", "-c", cmd});

        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        StringBuilder processOutput = new StringBuilder();

        try (BufferedReader processOutputReader = new BufferedReader(
                new InputStreamReader(process.getInputStream()));)
        {
            String readLine;

            while ((readLine = processOutputReader.readLine()) != null)
            {
                processOutput.append(readLine + System.lineSeparator());
            }

            process.waitFor();
        }

        try (BufferedReader processOutputReader = new BufferedReader(
                new InputStreamReader(process.getErrorStream()));)
        {
            String readLine;

            while ((readLine = processOutputReader.readLine()) != null)
            {
                processOutput.append(readLine + System.lineSeparator());
            }

            process.waitFor();
        }



        return processOutput.toString().trim();
    }
    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        ArrayList<String> str = new ArrayList<>(Arrays.asList(event.getMessage().getContentRaw().split(" ")));
        if (str.get(0).equals(".onlinecheck")) {
            event.getChannel().sendMessage("Yep, java is online").complete();
        }
        if (str.get(0).equals(".emulatejoin") && event.getAuthor().getId().equals("780889323162566697")){
            if(counter==5){
                counter=1;
            }
            try {
                event.getTextChannel().sendFile(addPeople(event.getMember().getUser().getName(), getUserAvatar(event.getAuthor()))).complete();
                counter++;
            } catch (Exception e) {
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                e.printStackTrace(pw);
                String sStackTrace = sw.toString();
                event.getGuild().getTextChannelById("784352935198064660").sendMessage(sStackTrace).complete();
            }
        }
        if (str.get(0).equals(".delete") && event.getAuthor().getId().equals("780889323162566697")) {
            event.getChannel().getHistory().retrievePast(2).queue(message -> {
                message.forEach(message1 -> {
                    message1.delete().queue();
                });
            });
        }
            if(str.get(0).equalsIgnoreCase(".class") && event.getAuthor().getId().equals("780889323162566697")){
            try {
                event.getTextChannel().sendFile(getClass(str.get(1), 0, event.getMember()))
                        .setActionRow(Button.secondary("goback", "Previous Class"), Button.success("confirm", "Confirm"), Button.secondary("goforward", "Next Class").asEnabled())
                        .complete();
                number.put(event.getMember(), 0);
                username.put(event.getMember(), str.get(1));
            }
            catch (IllegalArgumentException e){
                event.getMessage().reply("Please post a valid username!").complete();
            }
            catch(Exception e) {
                e.printStackTrace();
            }
        }
        if(str.get(0).equalsIgnoreCase(".exec") && event.getAuthor().getId().equals("780889323162566697")){
            try {
                str.remove(0);
                StringBuilder sb = new StringBuilder();
                for (String s : str) {
                    sb.append(s + " ");
                }
                String cmd = sb.toString();
                String result = getProcessOutput(cmd);
                EmbedBuilder embed = new EmbedBuilder();
                embed.setTitle("Console output");
                embed.setColor(Color.black);
                embed.setDescription(result.equals("") ? "``` No Output```" :"```" + result +  "```");
                embed.setAuthor(event.getMember().getNickname(), " https://discord.gg/rYMSHsR", "https://cdn.discordapp.com/avatars/780889323162566697/3484182b1268ebe81af27463bef07d39.webp?size=160");
                embed.setFooter("Command to run console cmds. Command for devs only");
                event.getChannel().sendMessageEmbeds(embed.build()).queue();
            } catch (Exception e){
                e.printStackTrace();
            }
        }

    }
    //$ cd my/folder/
    //$ git init
    //$ vim .gitignore
    //$ git add .;git commit -m 'my first commit'
    //$ git remote add origin https|ssh:path/to/the/repository.git
    //git pull origin master --allow-unrelated-histories

    @Override
    public void onButtonInteraction(ButtonInteractionEvent event) {
        try {
            if (event.getComponentId().equals("goback")) {
                int classpage = number.get(event.getMember()) == null ? 0 : number.get(event.getMember());
                event.editMessage(" ").queue(message -> {
                    message.editOriginal(" ")
                            .retainFilesById(Collections.emptyList())
                            .addFile(getClass(username.get(event.getMember()), classpage - 1, event.getMember()))
                            .queue();
                });
                number.put(event.getMember(), classpage - 1);
            }
            if (event.getComponentId().equals("goforward")) {
                int classpage = number.get(event.getMember()) == null ? 0 : number.get(event.getMember());
                event.editMessage(" ").queue(message -> {
                    message.editOriginal(" ")
                            .retainFilesById(Collections.emptyList())
                            .addFile(getClass(username.get(event.getMember()), classpage + 1, event.getMember()))
                            .queue();
                });
                number.put(event.getMember(), classpage + 1);
            }
            if(event.getComponentId().equals("confirm")){
                event.editMessage(" ").queue(message -> {
                    message.editOriginal(" ")
                            .retainFilesById(Collections.emptyList())
                            .addFile(getClassDetails(username.get(event.getMember()), number.get(event.getMember()), event.getMember()))
                            .queue();
                });
            }
        } catch(IllegalArgumentException e) {
            event.getMessage().reply("Please post a valid username!").complete();
        }
        catch(IndexOutOfBoundsException e){
            event.editMessage(" ").queue(message -> {
                message.editOriginal(" ")
                        .retainFilesById(Collections.emptyList())
                        .addFile(getClassDetails(username.get(event.getMember()), 0, event.getMember()))
                        .queue();
                number.put(event.getMember(), 0);
            });
        }
    }

    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        if (!event.getName().equals("player") && !event.getName().equals("p") && !event.getUser().getId().equals("780889323162566697") || !event.getName().equals("player") && !event.getName().equals("p") && !event.getUser().getId().equals("246865469963763713") )
            return;
        try {
            String playername = event.getOption("pname").getAsString();
            event.getInteraction().deferReply().queue(message -> {
                try{
                message.editOriginal(" ")
                        .addFile(getClass(playername, 0, event.getMember()))
                        .setActionRow(Button.secondary("goback", "Previous Class"), Button.success("confirm", "Confirm"), Button.secondary("goforward", "Next Class").asEnabled())
                        .queue();
                } catch(IllegalArgumentException e){
                    message.editOriginal("Please post a valid username")
                            .retainFiles(Collections.emptyList())
                            .queue();
                }
                });
            number.put(event.getMember(), 0);
            username.put(event.getMember(), playername);
        } catch(IllegalArgumentException e){
            event.reply("Please post a valid username!").complete();
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String sStackTrace = sw.toString();
            event.getGuild().getTextChannelById("673360036650680321").sendMessage(sStackTrace).complete();
        }
    }
}
