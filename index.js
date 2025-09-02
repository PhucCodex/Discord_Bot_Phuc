const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require('ms'); 
require('dotenv').config();


const DEFAULT_FEEDBACK_CHANNEL_ID = '1128546415250198539'; // ID kênh mặc định cho /feedback
const TICKET_CATEGORY_ID = '1412100711931445452'; // ID của Danh mục (Category) nơi các kênh ticket sẽ được tạo
const SUPPORT_ROLE_ID = '1412090993909563534';    // ID của vai trò (Role) Support Team



const commands = [
    new SlashCommandBuilder()
        .setName('info')
        .setDescription('Hiển thị thông tin người dùng.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Người bạn muốn xem thông tin')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('hi1')
        .setDescription('Gửi lời chào thân thương đến một người đáng yêu.')
        .addUserOption(option =>
            option.setName('người')
                .setDescription('Người bạn muốn chào')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('hi2')
        .setDescription('Gửi lời chúc theo buổi tới một người dễ thương.')
        .addUserOption(option =>
            option.setName('người')
                .setDescription('Người bạn muốn chúc')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('chon_buoi') 
                .setDescription('Chọn một buổi có sẵn trong ngày.')
                .setRequired(false) 
                .addChoices(
                    { name: '☀️ Buổi Sáng', value: 'sáng' },
                    { name: '🕛 Buổi Trưa', value: 'trưa' },
                    { name: '🌇 Buổi Chiều', value: 'chiều' },
                    { name: '🌙 Buổi Tối', value: 'tối' }
                )
        )
        .addStringOption(option =>
            option.setName('loi_chuc') 
                .setDescription('Hoặc tự nhập một lời chúc riêng.')
                .setRequired(false) 
        ),

    new SlashCommandBuilder()
        .setName('time')
        .setDescription('Xem thời gian hiện tại ở các quốc gia')
        .addStringOption(option =>
            option.setName('quoc_gia')
                .setDescription('Chọn quốc gia muốn xem giờ.')
                .setRequired(false)
                .addChoices(
                    { name: '🇻🇳 Việt Nam', value: 'Asia/Ho_Chi_Minh' },
                    { name: '🇯🇵 Nhật Bản', value: 'Asia/Tokyo' },
                    { name: '🇹🇼 Đài Loan', value: 'Asia/Taipei' },
                    { name: '🇹🇭 Thái Lan', value: 'Asia/Bangkok' },
                    { name: '🇺🇸 Bờ Tây Hoa Kỳ (Los Angeles, San Francisco)', value: 'America/Los_Angeles' },
                    { name: '🇷🇺 Nga (Moscow)', value: 'Europe/Moscow' },
                    { name: '🇬🇧 Vương quốc Anh', value: 'Europe/London' }
                )
        ),
    
    new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Mở một form để gửi phản hồi trực tiếp.')
        .addChannelOption(option =>
            option.setName('kênh')
                .setDescription('Kênh để gửi phản hồi. Bỏ trống sẽ gửi đến kênh mặc định.')
                .addChannelTypes(ChannelType.GuildText) 
                .setRequired(false)
        ),
    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick một thành viên khỏi server.')
        .addUserOption(option => option.setName('người').setDescription('Thành viên cần kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Lý do kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),

    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban một thành viên khỏi server.')
        .addUserOption(option => option.setName('người').setDescription('Thành viên cần ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Lý do ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    
    new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Gỡ ban cho một thành viên bằng ID.')
        .addStringOption(option => option.setName('userid').setDescription('ID của người dùng cần gỡ ban').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
        
    new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout một thành viên.')
        .addUserOption(option => option.setName('người').setDescription('Thành viên cần timeout').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('Thời gian mute (vd: 10m, 1h, 2d)').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Lý do mute'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),

    new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Gỡ timeout cho một thành viên.')
        .addUserOption(option => option.setName('người').setDescription('Thành viên cần gỡ timeout').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),

    new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Đổi nickname cho một thành viên.')
        .addUserOption(option => option.setName('người').setDescription('Thành viên cần đổi tên').setRequired(true))
        .addStringOption(option => option.setName('nickname').setDescription('Nickname mới').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
        .setDMPermission(false),

    new SlashCommandBuilder()
        .setName('move')
        .setDescription('Di chuyển một thành viên sang kênh thoại khác.')
        .addUserOption(option => option.setName('người').setDescription('Thành viên cần di chuyển').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('Kênh thoại muốn chuyển đến').addChannelTypes(ChannelType.GuildVoice).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
        .setDMPermission(false),
    
    new SlashCommandBuilder()
        .setName('ticketsetup')
        .setDescription('Cài đặt bảng điều khiển ticket có tùy chỉnh.')
        .addStringOption(option => option.setName('tieu_de').setDescription('Tiêu đề chính của bảng điều khiển.').setRequired(true))
        .addStringOption(option => option.setName('mo_ta').setDescription('Nội dung mô tả chi tiết. Dùng \\n để xuống dòng.').setRequired(true))
        .addStringOption(option => option.setName('hinh_anh').setDescription('URL hình ảnh (ảnh bìa) của bảng điều khiển.'))
        .addStringOption(option => option.setName('mau_sac').setDescription('Mã màu Hex cho đường viền (ví dụ: #FF5733).'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    

    new SlashCommandBuilder()
        .setName('formsetup')
        .setDescription('Cài đặt bảng điều khiển để mở form feedback.')
        .addStringOption(option => option.setName('tieu_de').setDescription('Tiêu đề chính của bảng điều khiển.').setRequired(true))
        .addStringOption(option => option.setName('mo_ta').setDescription('Nội dung mô tả chi tiết. Dùng \\n để xuống dòng.').setRequired(true))
        .addChannelOption(option => option.setName('kenh_nhan_form').setDescription('Kênh sẽ nhận kết quả form. Mặc định là kênh feedback chung.'))
        .addStringOption(option => option.setName('hinh_anh').setDescription('URL hình ảnh (ảnh bìa) của bảng điều khiển.'))
        .addStringOption(option => option.setName('mau_sac').setDescription('Mã màu Hex cho đường viền (ví dụ: #FF5733).'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


].map(command => command.toJSON());



const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Đang đăng ký các lệnh slash...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('Đã đăng ký thành công các lệnh slash.');
    } catch (error) {
        console.error('Lỗi khi đăng ký lệnh:', error);
    }
})();



const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

client.once('ready', () => {
    console.log(`✅ Bot đã online! Tên bot: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    
    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('feedbackModal_')) {
            const channelId = interaction.customId.split('_')[1];
            const tieuDe = interaction.fields.getTextInputValue('tieuDeInput');
            const noiDung = interaction.fields.getTextInputValue('noiDungInput');
            const danhGia = interaction.fields.getTextInputValue('danhGiaInput') || 'Chưa đánh giá';
            const feedbackEmbed = new EmbedBuilder().setColor('Green').setTitle(`📝 Phản hồi mới: ${tieuDe}`).setDescription(noiDung).addFields({ name: 'Đánh giá', value: `**${danhGia}**` }).setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() }).setTimestamp();
            try {
                const channel = await client.channels.fetch(channelId);
                if (channel) {
                    await channel.send({ embeds: [feedbackEmbed] });
                    await interaction.reply({ content: `Cảm ơn bạn! Phản hồi đã được gửi tới kênh ${channel}.`, ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Lỗi: Không tìm thấy kênh được chỉ định.', ephemeral: true });
                }
            } catch (error) {
                console.error("Lỗi khi gửi feedback:", error);
                await interaction.reply({ content: 'Đã có lỗi xảy ra. Có thể tôi không có quyền gửi tin nhắn vào kênh đó.', ephemeral: true });
            }
        }
        return;
    }

    if (interaction.isButton()) {
        const customId = interaction.customId;

        if (customId === 'create_ticket') {
            const ticketChannelName = `ticket-${interaction.user.username}`;
            const existingChannel = interaction.guild.channels.cache.find(c => c.name === ticketChannelName);
            if (existingChannel) {
                return interaction.reply({ content: `Bạn đã có một ticket đang mở tại ${existingChannel}.`, ephemeral: true });
            }
            try {
                const ticketChannel = await interaction.guild.channels.create({
                    name: ticketChannelName,
                    type: ChannelType.GuildText,
                    parent: TICKET_CATEGORY_ID,
                    permissionOverwrites: [
                        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                        { id: SUPPORT_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                    ],
                });
                const closeButton = new ButtonBuilder().setCustomId('close_ticket').setLabel('Đóng Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒');
                const row = new ActionRowBuilder().addComponents(closeButton);
                await ticketChannel.send({ content: `Chào mừng ${interaction.user}! Đội ngũ <@&${SUPPORT_ROLE_ID}> sẽ hỗ trợ bạn ngay.`, components: [row] });
                await interaction.reply({ content: `Đã tạo ticket của bạn tại ${ticketChannel}.`, ephemeral: true });
            } catch (error) {
                console.error("Lỗi khi tạo ticket:", error);
                await interaction.reply({ content: 'Đã có lỗi xảy ra khi tạo ticket. Vui lòng kiểm tra lại ID Category và quyền của bot.', ephemeral: true });
            }
        }
        if (customId === 'close_ticket') {
            if (!interaction.member.roles.cache.has(SUPPORT_ROLE_ID) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: 'Chỉ đội ngũ hỗ trợ mới có thể đóng ticket.', ephemeral: true });
            }
            await interaction.reply({ content: 'Đang xóa kênh...', ephemeral: true });
            interaction.channel.delete().catch(err => console.error("Không thể xóa kênh ticket:", err));
        }

        if (customId.startsWith('open_feedback_form_')) {
            const feedbackChannelId = customId.split('_')[3]; // Lấy ID kênh từ customId của nút
            
            const modal = new ModalBuilder()
                .setCustomId(`feedbackModal_${feedbackChannelId}`)
                .setTitle('Gửi phản hồi cho Phúc');

            const tieuDeInput = new TextInputBuilder().setCustomId('tieuDeInput').setLabel("Tên của bạn ?").setStyle(TextInputStyle.Short).setPlaceholder('Ghi ở đây !').setRequired(true);
            const noiDungInput = new TextInputBuilder().setCustomId('noiDungInput').setLabel("Nội dung").setStyle(TextInputStyle.Paragraph).setPlaceholder('Bạn muốn nói điều gì ? Hãy ghi ở đây !').setRequired(true).setMinLength(10);
            const danhGiaInput = new TextInputBuilder().setCustomId('danhGiaInput').setLabel("Nội dung 2").setStyle(TextInputStyle.Paragraph).setPlaceholder('Bạn muốn nói điều gì ? Hãy ghi ở đây ! Không có thì bỏ trống.').setRequired(false);
            
            const firstActionRow = new ActionRowBuilder().addComponents(tieuDeInput);
            const secondActionRow = new ActionRowBuilder().addComponents(noiDungInput);
            const thirdActionRow = new ActionRowBuilder().addComponents(danhGiaInput);
            
            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
            await interaction.showModal(modal);
        }

        return;
    }

    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;
        
        if (commandName === 'info') { 
            const user = interaction.options.getUser('user'); 
            await interaction.reply(`Tên người dùng: ${user.username}\nID: ${user.id}`); 
        }
        else if (commandName === 'hi1') { 
            const targetUser = interaction.options.getUser('người'); 
            await interaction.reply(`Hellu ${targetUser}, chúc bạn một ngày tốt lành! <:reaction_role_1876:1410282620738339040>`); 
        }
        else if (commandName === 'hi2') { 
            const targetUser = interaction.options.getUser('người');
            const chonBuoi = interaction.options.getString('chon_buoi');
            const loiChucTuyY = interaction.options.getString('loi_chuc'); 
            let loiChuc;

            if (loiChucTuyY) {
                loiChuc = `Hii ${targetUser}, ${loiChucTuyY}`;
            } else if (chonBuoi) {
                if (chonBuoi === 'sáng') { loiChuc = `Chào buổi sáng, ${targetUser}! Chúc bạn một ngày mới tràn đầy năng lượng! ☀️`; } 
                else if (chonBuoi === 'trưa') { loiChuc = `Buổi trưa vui vẻ nhé, ${targetUser}! Nhớ ăn uống đầy đủ nha. 🕛`; } 
                else if (chonBuoi === 'chiều') { loiChuc = `Chúc ${targetUser} một buổi chiều làm việc hiệu quả! 🌇`; } 
                else if (chonBuoi === 'tối') { loiChuc = `Buổi tối tốt lành và ngủ thật ngon nhé, ${targetUser}! 🌙`; }
            } else {
                loiChuc = `Hii ${targetUser}, chúc bạn một ngày tốt lành! 💕`;
            }
            await interaction.reply(loiChuc);
        }
        else if (commandName === 'time') { const timeZone = interaction.options.getString('quoc_gia') || 'Asia/Ho_Chi_Minh'; const choiceName = interaction.options.getString('quoc_gia') ? commands.find(c => c.name === 'time').options[0].choices.find(ch => ch.value === timeZone).name : '🇻🇳 Việt Nam'; const now = new Date(); const timeParts = new Intl.DateTimeFormat('en-GB', { timeZone: timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(now); const hour = timeParts.find(part => part.type === 'hour').value; const minute = timeParts.find(part => part.type === 'minute').value; const dateParts = new Intl.DateTimeFormat('vi-VN', { timeZone: timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now); const dateTimeString = `${hour}:${minute} ${dateParts}`; await interaction.reply(`Tại ${choiceName}, bây giờ là: ${dateTimeString} 🕒`); }
        else if (commandName === 'feedback') { const targetChannel = interaction.options.getChannel('kênh'); const feedbackChannelId = targetChannel ? targetChannel.id : DEFAULT_FEEDBACK_CHANNEL_ID; const modal = new ModalBuilder().setCustomId(`feedbackModal_${feedbackChannelId}`).setTitle('Gửi phản hồi cho Phúc'); const tieuDeInput = new TextInputBuilder().setCustomId('tieuDeInput').setLabel("Tên của bạn ?").setStyle(TextInputStyle.Short).setPlaceholder('Ghi ở đây !').setRequired(true); const noiDungInput = new TextInputBuilder().setCustomId('noiDungInput').setLabel("Nội dung").setStyle(TextInputStyle.Paragraph).setPlaceholder('Bạn muốn nói điều gì ? Hãy ghi ở đây !').setRequired(true); const danhGiaInput = new TextInputBuilder().setCustomId('danhGiaInput').setLabel("Đánh giá của bạn (Tốt, Cần cải thiện..)").setStyle(TextInputStyle.Short).setPlaceholder('Ghi ở đây !').setRequired(false); const firstActionRow = new ActionRowBuilder().addComponents(tieuDeInput); const secondActionRow = new ActionRowBuilder().addComponents(noiDungInput); const thirdActionRow = new ActionRowBuilder().addComponents(danhGiaInput); modal.addComponents(firstActionRow, secondActionRow, thirdActionRow); await interaction.showModal(modal); }
        else if (commandName === 'kick' || commandName === 'ban') { const target = interaction.options.getMember('người'); const reason = interaction.options.getString('reason') ?? 'Không có lý do được cung cấp.'; if (!target) return interaction.reply({ content: 'Không tìm thấy thành viên này.', ephemeral: true }); if (target.id === interaction.user.id) return interaction.reply({ content: 'Bạn không thể tự thực hiện hành động này lên chính mình!', ephemeral: true }); if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: 'Bạn không thể thực hiện hành động lên người có vai trò cao hơn hoặc bằng bạn.', ephemeral: true }); const action = commandName === 'kick' ? 'kick' : 'ban'; const actionVerb = commandName === 'kick' ? 'Kick' : 'Ban'; const color = commandName === 'kick' ? 'Orange' : 'Red'; if (!target[action + 'able']) return interaction.reply({ content: `Tôi không có quyền để ${action} thành viên này.`, ephemeral: true }); try { await target[action]({ reason }); const embed = new EmbedBuilder().setColor(color).setTitle(`${actionVerb} thành công`).setDescription(`**${target.user.tag}** đã bị ${action}.`).addFields({ name: 'Lý do', value: reason }).setTimestamp(); await interaction.reply({ embeds: [embed] }); } catch (error) { console.error(error); await interaction.reply({ content: `Đã xảy ra lỗi khi đang cố ${action} thành viên.`, ephemeral: true }); } }
        else if (commandName === 'unban') {
            const userId = interaction.options.getString('userid');
            try {
                await interaction.guild.members.unban(userId);
                const embed = new EmbedBuilder().setColor('Green').setTitle('Unban thành công').setDescription(`Đã gỡ ban cho người dùng có ID: **${userId}**.`);
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Đã xảy ra lỗi. Vui lòng kiểm tra lại ID hoặc có thể người dùng này không bị ban.', ephemeral: true });
            }
        }
        else if (commandName === 'timeout') { const target = interaction.options.getMember('người'); const durationStr = interaction.options.getString('time'); const reason = interaction.options.getString('reason') ?? 'Không có lý do.'; if (!target) return interaction.reply({ content: 'Không tìm thấy thành viên.', ephemeral: true }); if (target.id === interaction.user.id) return interaction.reply({ content: 'Bạn không thể tự timeout mình!', ephemeral: true }); if (target.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'Bạn không thể timeout một Quản trị viên!', ephemeral: true }); if (target.roles.highest.position >= interaction.member.roles.highest.position) { return interaction.reply({ content: 'Bạn không thể timeout người có vai trò cao hơn hoặc bằng bạn.', ephemeral: true }); } if (!target.moderatable) { return interaction.reply({ content: 'Tôi không có quyền để timeout thành viên này. Vui lòng kiểm tra lại vai trò của tôi.', ephemeral: true }); } const durationMs = ms(durationStr); if (!durationMs || durationMs > ms('28d')) return interaction.reply({ content: 'Thời gian không hợp lệ. Vui lòng dùng định dạng như "10m", "1h", "2d" và không quá 28 ngày.', ephemeral: true }); try { await target.timeout(durationMs, reason); const embed = new EmbedBuilder().setColor('Yellow').setTitle('Timeout thành công').setDescription(`**${target.user.tag}** đã bị timeout.`).addFields({ name: 'Thời gian', value: durationStr }, { name: 'Lý do', value: reason }).setTimestamp(); await interaction.reply({ embeds: [embed] }); } catch (error) { console.error(error); await interaction.reply({ content: 'Đã xảy ra lỗi khi đang cố timeout thành viên.', ephemeral: true }); } }
        else if (commandName === 'untimeout') {
            const target = interaction.options.getMember('người');
            if (!target) return interaction.reply({ content: 'Không tìm thấy thành viên.', ephemeral: true });
            if (target.id === interaction.user.id) return interaction.reply({ content: 'Bạn không thể tự gỡ timeout cho mình!', ephemeral: true });
            if (target.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({ content: 'Bạn không thể gỡ timeout cho người có vai trò cao hơn hoặc bằng bạn.', ephemeral: true });
            }
            if (!target.moderatable) {
                return interaction.reply({ content: 'Tôi không có quyền để quản lý thành viên này.', ephemeral: true });
            }
            if (!target.isCommunicationDisabled()) {
                return interaction.reply({ content: 'Thành viên này không đang bị timeout.', ephemeral: true });
            }
            try {
                await target.timeout(null); 
                const embed = new EmbedBuilder().setColor('Green').setTitle('Gỡ Timeout thành công').setDescription(`Đã gỡ timeout cho **${target.user.tag}**.`);
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Đã xảy ra lỗi khi đang cố gỡ timeout.', ephemeral: true });
            }
        }
        else if (commandName === 'rename') { const target = interaction.options.getMember('người'); const nickname = interaction.options.getString('nickname'); if (!target) return interaction.reply({ content: 'Không tìm thấy thành viên.', ephemeral: true }); if (target.roles.highest.position >= interaction.member.roles.highest.position && interaction.guild.ownerId !== interaction.user.id) return interaction.reply({ content: 'Bạn không thể đổi tên người có vai trò cao hơn hoặc bằng bạn.', ephemeral: true }); try { const oldNickname = target.displayName; await target.setNickname(nickname); const embed = new EmbedBuilder().setColor('Blue').setTitle('Đổi tên thành công').setDescription(`Đã đổi nickname của **${target.user.tag}** từ \`${oldNickname}\` thành \`${nickname}\`.`); await interaction.reply({ embeds: [embed] }); } catch (error) { console.error(error); await interaction.reply({ content: 'Đã xảy ra lỗi khi đang cố đổi tên thành viên. Có thể nickname quá dài hoặc tôi không có quyền.', ephemeral: true }); } }
        else if (commandName === 'move') { const target = interaction.options.getMember('người'); const channel = interaction.options.getChannel('channel'); if (!target) return interaction.reply({ content: 'Không tìm thấy thành viên.', ephemeral: true }); if (!target.voice.channel) return interaction.reply({ content: 'Thành viên này không ở trong kênh thoại nào.', ephemeral: true }); try { await target.voice.setChannel(channel); const embed = new EmbedBuilder().setColor('Purple').setTitle('Di chuyển thành công').setDescription(`Đã di chuyển **${target.user.tag}** đến kênh thoại **${channel.name}**.`); await interaction.reply({ embeds: [embed] }); } catch (error) { console.error(error); await interaction.reply({ content: 'Đã xảy ra lỗi khi đang cố di chuyển thành viên. Vui lòng kiểm tra lại quyền của tôi.', ephemeral: true }); } }
        else if (commandName === 'ticketsetup') {
            const tieuDe = interaction.options.getString('tieu_de');
            const moTa = interaction.options.getString('mo_ta').replace(/\\n/g, '\n'); 
            const hinhAnh = interaction.options.getString('hinh_anh');
            const mauSac = interaction.options.getString('mau_sac');
            const ticketEmbed = new EmbedBuilder().setTitle(tieuDe).setDescription(moTa);
            if (mauSac) ticketEmbed.setColor(mauSac);
            if (hinhAnh) ticketEmbed.setImage(hinhAnh);
            const openButton = new ButtonBuilder().setCustomId('create_ticket').setLabel('Mở Ticket').setStyle(ButtonStyle.Success).setEmoji('<:Email37:1412322372790255636>');
            const row = new ActionRowBuilder().addComponents(openButton);
            await interaction.channel.send({ embeds: [ticketEmbed], components: [row] });
            await interaction.reply({ content: 'Đã cài đặt thành công bảng điều khiển ticket.', ephemeral: true });
        }
        else if (commandName === 'formsetup') {
            const tieuDe = interaction.options.getString('tieu_de');
            const moTa = interaction.options.getString('mo_ta').replace(/\\n/g, '\n');
            const hinhAnh = interaction.options.getString('hinh_anh');
            const mauSac = interaction.options.getString('mau_sac');
            const kenhNhanForm = interaction.options.getChannel('kenh_nhan_form');
            const feedbackChannelId = kenhNhanForm ? kenhNhanForm.id : DEFAULT_FEEDBACK_CHANNEL_ID;

            const formEmbed = new EmbedBuilder().setTitle(tieuDe).setDescription(moTa);
            if (mauSac) formEmbed.setColor(mauSac);
            if (hinhAnh) formEmbed.setImage(hinhAnh);

            const openFormButton = new ButtonBuilder()
                .setCustomId(`open_feedback_form_${feedbackChannelId}`) // Gắn ID kênh nhận vào nút
                .setLabel('Hỗ Trợ')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:email49:1412322374891602020>');
            
            const row = new ActionRowBuilder().addComponents(openFormButton);

            await interaction.channel.send({ embeds: [formEmbed], components: [row] });
            await interaction.reply({ content: 'Đã cài đặt thành công bảng điều khiển form.', ephemeral: true });
        }
    }
});


client.login(process.env.DISCORD_TOKEN);

